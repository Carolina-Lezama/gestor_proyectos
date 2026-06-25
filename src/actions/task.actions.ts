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

    // 4. Inserción en PostgreSQL
    await prisma.task.create({
      data: {
        title: title.trim(),
        projectId,
        status,
        position: currentTasksCount, // La colocamos exactamente al final
        priority: "MEDIUM", // Valor por defecto
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