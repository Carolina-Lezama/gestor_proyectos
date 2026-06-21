"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateUserProfile(formData: FormData) {
  // 1. Verificamos la sesión para asegurar que nadie modifique perfiles ajenos
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "No autorizado. Inicia sesión nuevamente." };
  }

  // 2. Extraemos los datos del formulario
  const name = formData.get("name") as string;

  if (!name || name.trim() === "") {
    return { error: "El nombre no puede estar vacío." };
  }

  try {
    // 3. Actualizamos en PostgreSQL
    await prisma.user.update({
      where: { id: session.user.id },
      data: { name },
    });

    // 4. Refrescamos la caché de Next.js para que el layout y la página se actualicen al instante
    revalidatePath("/", "layout");

    return { success: "Perfil actualizado correctamente." };
  } catch (error) {
    return { error: "Ocurrió un error al guardar los cambios en la base de datos." };
  }
}