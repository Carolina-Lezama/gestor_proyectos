"use server";

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";

const prisma = new PrismaClient();

// Acción 1: Inserción de Usuario (Registro)
export async function registerUser(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password || !name) return { error: "Todos los campos son obligatorios" };

  try {
    // 1. Verificamos que el correo no exista
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return { error: "El correo ya está registrado" };

    // 2. Encriptamos la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Guardamos en la BD
    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    return { success: true };
  } catch (error) {
    return { error: "Ocurrió un error al registrar el usuario" };
  }
}

// Acción 2: Verificación (Login)
export async function loginUser(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/dashboard", // Redirección automática si tiene éxito
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Credenciales inválidas. Verifica tu correo y contraseña." };
    }
    // Next.js usa throw para manejar las redirecciones internas, no lo captures
    throw error;
  }
}