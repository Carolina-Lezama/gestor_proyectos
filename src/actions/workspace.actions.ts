"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createWorkspace(formData: FormData) {
  // 1. Verificamos la sesión
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "No autorizado. Inicia sesión nuevamente." };
  }

  // 2. Extraemos los datos
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;

  if (!name || name.trim() === "") {
    return { error: "El nombre del equipo es obligatorio." };
  }

  try {
    // 3. Inserción atómica (Anidada)
    const newWorkspace = await prisma.workspace.create({
      data: {
        name,
        description: description || null,
        // Al mismo tiempo que se crea el workspace, creamos el registro del miembro
        members: {
          create: {
            userId: session.user.id,
            role: "OWNER", // El creador siempre es el propietario por defecto
          },
        },
      },
    });

    // 4. Limpiamos la caché para que la pantalla de equipos se actualice al instante
    revalidatePath("/workspaces");
    revalidatePath("/", "layout"); // Para que el selector superior también se entere

    return { success: "Equipo creado correctamente.", workspaceId: newWorkspace.id };
  } catch (error) {
    console.error(error);
    return { error: "Ocurrió un error al crear el equipo." };
  }
}