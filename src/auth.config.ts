import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  // Dejamos los providers vacíos aquí para que el Edge no truene
  providers: [], 
} satisfies NextAuthConfig;