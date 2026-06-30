import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { cookies } from "next/headers"; // <-- Nuevo import
import { KanbanBoard } from "@/components/kanban/KanbanBoard";
import { ProjectSelector } from "@/components/kanban/ProjectSelector"; // <-- Nuevo Import
import { Card, CardContent } from "@/components/ui/card";
import { FolderKanban, AlertCircle } from "lucide-react";
import Link from "next/link";

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

  // 1. LECTURA DE COOKIE (Memoria a corto plazo)
  if (!activeWorkspaceId) {
    const cookieStore = await cookies();
    const cookieWorkspaceId = cookieStore.get("activeWorkspaceId")?.value;

    if (cookieWorkspaceId) {
      // Validación de seguridad: Comprobar que la cookie no es obsoleta y el usuario sigue en el equipo
      const hasAccess = await prisma.workspaceMember.findUnique({
        where: {
          userId_workspaceId: { userId: session.user.id, workspaceId: cookieWorkspaceId }
        }
      });
      if (hasAccess) activeWorkspaceId = cookieWorkspaceId;
    }
  }

  // 2. FALLBACK ABSOLUTO (Si no hay URL y no hay Cookie, buscamos el primer equipo)
  if (!activeWorkspaceId) {
    const firstWorkspace = await prisma.workspaceMember.findFirst({
      where: { userId: session.user.id },
      select: { workspaceId: true },
      orderBy: { joinedAt: "desc" }
    });
    
    if (firstWorkspace) {
      activeWorkspaceId = firstWorkspace.workspaceId;
    } else {
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

// 2. Extraemos TODOS los proyectos vinculados a este Workspace
  const projects = await prisma.project.findMany({
    where: { workspaceId: activeWorkspaceId },
    select: { id: true, name: true },
    orderBy: { createdAt: "desc" }
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
      {/* Encabezado del Tablero con el Selector Integrado */}
      <div className="border-b border-slate-200 pb-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Panel de Control</span>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 mt-0.5">Línea de Trabajo</h1>
        </div>
        
        {/* Renderizado del componente interactivo pasando los datos del servidor */}
        <ProjectSelector 
          workspaceId={activeWorkspaceId} 
          activeProjectId={activeProjectId} 
          projects={projects} 
        />
      </div>

      {/* Tablero Kanban */}
      <KanbanBoard projectId={activeProjectId} groupedTasks={groupedTasks} />
    </div>
  );
}