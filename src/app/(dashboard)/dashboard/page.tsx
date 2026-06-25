import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { KanbanBoard } from "@/components/kanban/KanbanBoard";
import { Card, CardContent } from "@/components/ui/card";
import { FolderKanban, AlertCircle } from "lucide-react";
import Link from "lucide-react";

interface DashboardProps {
  searchParams: Promise<{
    workspaceId?: string;
    projectId?: string;
  }>;
}

export default async function DashboardPage({ searchParams }: DashboardProps) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const params = await searchParams;
  let activeWorkspaceId = params.workspaceId;

  // 1. Si el usuario entra al raíz sin especificar equipo, buscamos su primer espacio disponible
  if (!activeWorkspaceId) {
    const firstWorkspace = await prisma.workspaceMember.findFirst({
      where: { userId: session.user.id },
      select: { workspaceId: true }
    });
    
    if (firstWorkspace) {
      activeWorkspaceId = firstWorkspace.workspaceId;
    } else {
      // Si no tiene ningún equipo, lo invitamos cordialmente a crear uno
      return (
        <div className="py-12 text-center max-w-xl mx-auto">
          <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-800">Se requiere un Espacio de Trabajo</h2>
          <p className="text-slate-500 text-sm mt-2">
            Para visualizar el tablero Kanban, primero debes crear o unirte a un equipo en la sección de <strong>Espacios de Trabajo</strong>.
          </p>
        </div>
      );
    }
  }

  // 2. Buscamos los proyectos que viven dentro de este Workspace específico
  const projects = await prisma.project.findMany({
    where: { workspaceId: activeWorkspaceId },
    select: { id: true, name: true }
  });

  if (projects.length === 0) {
    return (
      <div className="py-12 text-center max-w-xl mx-auto">
        <FolderKanban className="w-12 h-12 text-slate-400 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-slate-800">No hay proyectos activos</h2>
        <p className="text-slate-500 text-sm mt-2">
          Este espacio de trabajo está listo. Ve a la sección de proyectos para inicializar el primer repositorio de tareas del equipo.
        </p>
      </div>
    );
  }

  // 3. Determinamos qué proyecto está activo (el de la URL o el primero por defecto)
  const activeProjectId = params.projectId || projects[0].id;
  const activeProjectName = projects.find(p => p.id === activeProjectId)?.name || projects[0].name;

  // 4. Traemos todas las tareas de ese proyecto ordenadas por su posición en el Kanban
  const tasks = await prisma.task.findMany({
    where: { projectId: activeProjectId },
    select: {
      id: true,
      title: true,
      description: true,
      status: true,
      priority: true,
      dueDate: true,
      position: true,
    },
    orderBy: {
      position: "asc" // Crucial para mantener el orden del ordenamiento
    }
  });

  // 5. La Estrategia: Agrupamos las tareas por su TaskStatus en el servidor (Complejidad O(n))
  const groupedTasks = {
    TODO: [] as typeof tasks,
    IN_PROGRESS: [] as typeof tasks,
    IN_REVIEW: [] as typeof tasks,
    DONE: [] as typeof tasks,
  };

  tasks.forEach((task) => {
    if (groupedTasks[task.status]) {
      groupedTasks[task.status].push(task);
    }
  });

  return (
    <div className="space-y-6">
      {/* Encabezado del Tablero */}
      <div className="border-b border-slate-200 pb-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Proyecto Activo</span>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 mt-0.5">{activeProjectName}</h1>
        </div>
      </div>

      {/* Inyectamos la estructura limpia lista para pintar en pantalla */}
      <KanbanBoard projectId={activeProjectId} groupedTasks={groupedTasks} />
    </div>
  );
}