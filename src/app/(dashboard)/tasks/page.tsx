import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { MyTasksList, MyTaskItem } from "@/components/tasks/MyTasksList";

interface TasksPageProps {
  searchParams: Promise<{
    workspaceId?: string;
  }>;
}

export default async function TasksPage({ searchParams }: TasksPageProps) {
  // 1. Verificación estricta de seguridad en el servidor
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const params = await searchParams;
  let activeWorkspaceId = params.workspaceId;

  // 2. Lógica de Fallback para el Workspace
  // Si navegamos directamente a /tasks sin un query param, buscamos tu espacio más reciente
  if (!activeWorkspaceId) {
    const firstWorkspace = await prisma.workspaceMember.findFirst({
      where: { userId: session.user.id },
      select: { workspaceId: true },
      orderBy: { joinedAt: "desc" }
    });

    if (firstWorkspace) {
      activeWorkspaceId = firstWorkspace.workspaceId;
    } else {
      // Si eres un usuario completamente nuevo sin equipos, devolvemos la lista vacía de forma segura
      return <MyTasksList initialTasks={[]} />;
    }
  }

  // 3. Consulta Relacional Optimizada con Prisma
  // Buscamos tareas asignadas al usuario actual que pertenezcan a proyectos del espacio activo
  const dbTasks = await prisma.task.findMany({
    where: {
      assigneeId: session.user.id, // Filtro por usuario
      project: {
        workspaceId: activeWorkspaceId // Filtro por multi-tenant (Workspace)
      }
    },
    select: {
      id: true,
      title: true,
      status: true,
      priority: true,
      dueDate: true,
      project: {
        select: {
          name: true // Hacemos un JOIN implícito para traer solo el nombre del proyecto
        }
      }
    },
    orderBy: {
      createdAt: "desc" // Las tareas más nuevas aparecen primero en la agenda
    }
  });

  // 4. Adaptación estricta de tipos para el componente de cliente
  const formattedTasks: MyTaskItem[] = dbTasks.map((task) => ({
    id: task.id,
    title: task.title,
    status: task.status,
    priority: task.priority,
    dueDate: task.dueDate,
    project: {
      name: task.project.name
    }
  }));

  // 5. Renderizado inmediato con los datos listos
  return <MyTasksList initialTasks={formattedTasks} />;
}