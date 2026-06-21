import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { ProfileForm } from "@/components/profile/ProfileForm";

export default async function ProfilePage() {
  // 1. Obtenemos la sesión actual del Edge/Servidor
  const session = await auth();

  // Si por alguna razón no hay sesión, lo expulsamos al login
  if (!session?.user?.email) {
    redirect("/login");
  }

  // 2. Buscamos la información más reciente y fresca en PostgreSQL
  const dbUser = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      id: true,
      name: true,
      email: true,
      avatarUrl: true,
    }
  });

  if (!dbUser) {
    redirect("/login");
  }

  // 3. Renderizamos el formulario interactivo inyectando los datos reales
  return <ProfileForm user={dbUser} />;
}