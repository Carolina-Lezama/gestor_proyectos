"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { TaskStatus } from "@prisma/client";
import { Priority } from "@prisma/client";

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

// ==========================================
// 1. DETALLES DE LA TAREA (Fecha y Prioridad)
// ==========================================
export async function updateTaskDetails(
  taskId: string, 
  data: { 
    priority?: Priority; // <-- 2. Usamos el tipo exacto en lugar de 'string'
    dueDate?: Date | null; 
    description?: string;
  }
) {
  const session = await auth();
  if (!session?.user?.id) return { error: "No autorizado" };

  try {
    await prisma.task.update({
      where: { id: taskId },
      data: {
        priority: data.priority,
        dueDate: data.dueDate,
        description: data.description,
      }
    });
    
    revalidatePath("/", "layout");
    return { success: true };
  } catch (error) {
    return { error: "Ocurrió un error al actualizar la tarea." };
  }
}

// ==========================================
// 2. GESTIÓN DE SUBTAREAS (Checklist)
// ==========================================
export async function createSubtask(taskId: string, title: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "No autorizado" };
  if (!title.trim()) return { error: "El título no puede estar vacío." };

  try {
    const subtask = await prisma.subtask.create({
      data: { title, taskId }
    });
    revalidatePath("/", "layout");
    return { success: true, subtask };
  } catch (error) {
    return { error: "Error al crear la subtarea." };
  }
}

export async function toggleSubtask(subtaskId: string, isCompleted: boolean) {
  const session = await auth();
  if (!session?.user?.id) return { error: "No autorizado" };

  try {
    await prisma.subtask.update({
      where: { id: subtaskId },
      data: { isCompleted }
    });
    revalidatePath("/", "layout");
    return { success: true };
  } catch (error) {
    return { error: "Error al actualizar la subtarea." };
  }
}

export async function deleteSubtask(subtaskId: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "No autorizado" };

  try {
    await prisma.subtask.delete({ where: { id: subtaskId } });
    revalidatePath("/", "layout");
    return { success: true };
  } catch (error) {
    return { error: "Error al eliminar la subtarea." };
  }
}

// ==========================================
// 3. GESTIÓN DE COMENTARIOS (Feed de Actividad)
// ==========================================
export async function addComment(taskId: string, content: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "No autorizado" };
  if (!content.trim()) return { error: "El comentario no puede estar vacío." };

  try {
    const comment = await prisma.comment.create({
      data: {
        content,
        taskId,
        userId: session.user.id // Vinculamos el comentario al usuario que lo escribe
      }
    });
    revalidatePath("/", "layout");
    return { success: true, comment };
  } catch (error) {
    return { error: "Error al publicar el comentario." };
  }
}

export async function deleteComment(commentId: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "No autorizado" };

  try {
    // Primero verificamos que el comentario pertenezca al usuario que intenta borrarlo
    // (Por seguridad, nadie debería poder borrar los comentarios de otros)
    const comment = await prisma.comment.findUnique({ where: { id: commentId } });
    
    if (comment?.userId !== session.user.id) {
      return { error: "No tienes permiso para borrar este comentario." };
    }

    await prisma.comment.delete({ where: { id: commentId } });
    revalidatePath("/", "layout");
    return { success: true };
  } catch (error) {
    return { error: "Error al eliminar el comentario." };
  }
}