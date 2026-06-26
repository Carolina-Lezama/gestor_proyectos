"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { TaskStatus } from "@prisma/client";

export async function createTask(formData: FormData) {
  // 1. Verificación de seguridad
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "No autorizado." };
  }

  // 2. Extracción de datos del formulario oculto
  const title = formData.get("title") as string;
  const projectId = formData.get("projectId") as string;
  const status = formData.get("status") as TaskStatus;

  if (!title || !title.trim() || !projectId || !status) {
    return { error: "Faltan datos obligatorios." };
  }

  try {
    // 3. Estrategia de Posicionamiento: Contamos cuántas tareas hay en esa columna
    const currentTasksCount = await prisma.task.count({
      where: {
        projectId: projectId,
        status: status,
      },
    });

    // 4. Inserción en PostgreSQL (¡Ahora con auto-asignación!)
    await prisma.task.create({
      data: {
        title: title.trim(),
        projectId,
        status,
        position: currentTasksCount, 
        priority: "MEDIUM", 
        // 👇 ESTA ES LA LÍNEA CLAVE DEL PASO 1 👇
        assigneeId: session.user.id, 
      },
    });

    // 5. Refrescamos el tablero de forma instantánea
    revalidatePath("/dashboard");

    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Error al crear la tarea en la base de datos." };
  }
}
interface TaskOrderUpdate {
  id: string;
  status: TaskStatus;
  position: number;
}

export async function updateTasksOrder(tasksToUpdate: TaskOrderUpdate[]) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "No autorizado." };
  }

  try {
    // Usamos $transaction de Prisma para ejecutar todas las actualizaciones
    // al mismo tiempo. Si una falla, todas se cancelan (Atomicidad).
    await prisma.$transaction(
      tasksToUpdate.map((task) =>
        prisma.task.update({
          where: { id: task.id },
          data: {
            status: task.status,
            position: task.position,
          },
        })
      )
    );

    return { success: true };
  } catch (error) {
    console.error("Error al reordenar tareas:", error);
    return { error: "Ocurrió un error al persistir el nuevo orden en la base de datos." };
  }
}

// Añade esto al final de src/actions/task.actions.ts

export async function updateTaskStatus(taskId: string, newStatus: TaskStatus) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "No autorizado." };
  }

  try {
    // Actualizamos la tarea en PostgreSQL asegurándonos de que solo el asignado o el dueño pueda hacerlo
    await prisma.task.update({
      where: { 
        id: taskId,
        // Medida de seguridad adicional: asegurar que solo mute tareas que le pertenecen (opcional pero recomendado)
        // assigneeId: session.user.id 
      },
      data: {
        status: newStatus,
      },
    });

    // Invalidador de caché: Actualizamos tanto la vista personal como el Kanban general
    revalidatePath("/tasks");
    revalidatePath("/dashboard");

    return { success: true };
  } catch (error) {
    console.error("Error al actualizar estado de la tarea:", error);
    return { error: "No se pudo actualizar la tarea en la base de datos." };
  }
}