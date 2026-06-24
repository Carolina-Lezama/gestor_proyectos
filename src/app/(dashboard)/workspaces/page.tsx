import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { WorkspaceList } from "@/components/workspaces/WorkspaceList";

export default async function WorkspacesPage() {
  // 1. Validamos la sesión segura en el servidor
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  // 2. Extraemos todos los workspaces donde el usuario sea miembro
  const userWorkspaces = await prisma.workspaceMember.findMany({
    where: {
      userId: session.user.id,
    },
    select: {
      role: true, // Traemos el rol (OWNER, ADMIN, MEMBER)
      workspace: {
        select: {
          id: true,
          name: true,
          description: true,
          createdAt: true,
          // Agregación de Prisma: cuenta los proyectos de este workspace en una sola consulta
          _count: {
            select: { projects: true }
          }
        }
      }
    },
    orderBy: {
      joinedAt: "desc" // Los equipos más recientes primero
    }
  });

  // 3. Pasamos los datos puros al componente interactivo de cliente
  return <WorkspaceList initialWorkspaces={userWorkspaces} />;
}