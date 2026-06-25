"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createProject(formData: FormData) {
  // 1. Control de acceso: Validamos que haya una sesión de servidor activa
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "No autorizado. Por favor, inicia sesión nuevamente." };
  }

  // 2. Extracción segura de los campos del formulario
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const workspaceId = formData.get("workspaceId") as string;

  // 3. Validaciones de Regla de Negocio
  if (!name || name.trim() === "") {
    return { error: "El nombre del proyecto es obligatorio." };
  }

  if (!workspaceId || workspaceId.trim() === "") {
    return { error: "Error de consistencia: No se detectó un espacio de trabajo activo." };
  }

  try {
    // 4. Operación CRUD con Prisma en PostgreSQL
    const newProject = await prisma.project.create({
      data: {
        name: name.trim(),
        description: description ? description.trim() : null,
        workspaceId: workspaceId, // Clave foránea que lo amarra al tenant
      },
    });

    // 5. Invalidador de caché: Forzamos a Next.js a destruir el HTML estático viejo
    // Esto asegura que al volver a estas páginas se rendericen los datos frescos inmediatamente
    revalidatePath("/projects");
    revalidatePath("/dashboard");

    return { 
      success: "Proyecto creado y vinculado exitosamente.", 
      projectId: newProject.id 
    };
  } catch (error) {
    console.error("Error crítico en createProject Server Action:", error);
    return { error: "Error interno del servidor al procesar la inserción del proyecto." };
  }
}