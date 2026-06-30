import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { cookies } from "next/headers"; // <-- Nuevo import
import { ProjectList, ProjectItem } from "@/components/projects/ProjectList";

interface ProjectsPageProps {
  searchParams: Promise<{
    workspaceId?: string;
  }>;
}

export default async function ProjectsPage({ searchParams }: ProjectsPageProps) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const params = await searchParams;
  let activeWorkspaceId = params.workspaceId;

  // 1. LECTURA DE COOKIE
  if (!activeWorkspaceId) {
    const cookieStore = await cookies();
    const cookieWorkspaceId = cookieStore.get("activeWorkspaceId")?.value;

    if (cookieWorkspaceId) {
      const hasAccess = await prisma.workspaceMember.findUnique({
        where: { userId_workspaceId: { userId: session.user.id, workspaceId: cookieWorkspaceId } }
      });
      if (hasAccess) activeWorkspaceId = cookieWorkspaceId;
    }
  }

  // 2. FALLBACK ABSOLUTO
  if (!activeWorkspaceId) {
    const firstWorkspace = await prisma.workspaceMember.findFirst({
      where: { userId: session.user.id },
      select: { workspaceId: true },
      orderBy: { joinedAt: "desc" }
    });

    if (firstWorkspace) {
      activeWorkspaceId = firstWorkspace.workspaceId;
    } else {
      return <ProjectList activeWorkspaceId="" initialProjects={[]} />;
    }
  }
  // 3. Validación de Seguridad y Extracción de Miembros
  // Nos aseguramos de que el usuario no intente acceder a un workspace que no le pertenece
  const workspaceAccess = await prisma.workspaceMember.findUnique({
    where: {
      userId_workspaceId: {
        userId: session.user.id,
        workspaceId: activeWorkspaceId
      }
    },
    include: {
      workspace: {
        include: {
          // Traemos a los primeros 3 miembros del equipo para los avatares
          members: {
            take: 3,
            include: { user: { select: { name: true } } }
          }
        }
      }
    }
  });

  if (!workspaceAccess) {
    redirect("/dashboard"); // Redirección silenciosa si hay intento de violación de acceso
  }

  // Mapeamos los nombres reales a iniciales para los avatares (Ej: "Carolina Carrera" -> "CC")
  const teamInitials = workspaceAccess.workspace.members.map(member => {
    const name = member.user.name || "U";
    return name.split(" ").map(n => n[0]).join("").toUpperCase().substring(0, 2);
  });

  // 4. Consulta Principal: Proyectos con sus Tareas Anidadas
  const dbProjects = await prisma.project.findMany({
    where: { workspaceId: activeWorkspaceId },
    include: {
      // Pedimos las tareas solo para contar su estado y calcular el progreso real
      tasks: {
        select: { status: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  // 5. Transformación y Cálculo Matemático en el Servidor
  const formattedProjects: ProjectItem[] = dbProjects.map(project => {
    const totalTasks = project.tasks.length;
    const completedTasks = project.tasks.filter(task => task.status === "DONE").length;
    
    // Evitamos división por cero y redondeamos el porcentaje
    const progressPercentage = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

    return {
      id: project.id,
      name: project.name,
      description: project.description,
      progress: progressPercentage,
      status: progressPercentage === 100 ? "Completado" : "Activo",
      members: teamInitials
    };
  });

  // 6. Inyección de Datos Limpios al Componente de Cliente
  return (
    <ProjectList 
      activeWorkspaceId={activeWorkspaceId} 
      initialProjects={formattedProjects} 
    />
  );
}