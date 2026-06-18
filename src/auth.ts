import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login", // Redirige aquí si no hay sesión
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        
        // Buscamos al usuario en PostgreSQL
        const user = await prisma.user.findUnique({ 
          where: { email: credentials.email as string } 
        });
        
        if (!user || !user.password) return null;
        
        // Comparamos la contraseña encriptada
        const isValid = await bcrypt.compare(credentials.password as string, user.password);
        
        if (!isValid) return null;
        
        // Si es válido, devolvemos los datos para la sesión
        return { id: user.id, email: user.email, name: user.name };
      }
    })
  ],
});