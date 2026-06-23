"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateUserProfile(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "No autorizado. Inicia sesión nuevamente." };
  }

  // Extraemos todos los datos del formulario
  const name = formData.get("name") as string;
  const phone = formData.get("phone") as string;
  const city = formData.get("city") as string;

  if (!name || name.trim() === "") {
    return { error: "El nombre no puede estar vacío." };
  }

  try {
    // Actualizamos la base de datos con los nuevos campos
    await prisma.user.update({
      where: { id: session.user.id },
      data: { 
        name,
        phone: phone || null,
        city: city || null
      },
    });

    revalidatePath("/", "layout");

    return { success: "Perfil actualizado correctamente." };
  } catch (error) {
    return { error: "Ocurrió un error al guardar los cambios en la base de datos." };
  }
}