import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// Cargamos una tipografía limpia y profesional
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TaskFlow Pro | Gestor de Proyectos",
  description: "Sistema avanzado de gestión de proyectos y equipos.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={inter.className}>
        {/* Aquí se inyectarán nuestros layouts hijos (auth o dashboard) */}
        {children}
      </body>
    </html>
  );
}