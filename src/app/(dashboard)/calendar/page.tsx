import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { CalendarDays, AlertCircle } from "lucide-react";
// Importaremos el componente de cliente que crearemos en el Paso 3
import { CalendarGrid } from "@/components/calendar/CalendarGrid"; 

interface CalendarPageProps {
  searchParams: Promise<{
    workspaceId?: string;
  }>;
}

export default async function CalendarPage({ searchParams }: CalendarPageProps) {
  // 1. SEGURIDAD Y CONTEXTO ACTIVO
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const params = await searchParams;
  let activeWorkspaceId = params.workspaceId;

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
            No tienes un equipo activo para visualizar el calendario.
          </p>
        </div>
      );
    }
  }

  // 2. EXTRACCIÓN OPTIMIZADA (Excluyendo tareas sin fecha límite)
  const dbTasks = await prisma.task.findMany({
    where: {
      project: { workspaceId: activeWorkspaceId },
      dueDate: { not: null } // Filtro estricto: Solo tareas con fecha programada
    },
    select: {
      id: true,
      title: true,
      status: true,
      priority: true,
      dueDate: true,
      project: {
        select: { name: true }
      }
    },
    orderBy: {
      dueDate: 'asc' // Las ordenamos cronológicamente desde la base de datos
    }
  });

  // 3. ADAPTACIÓN DE DATOS (Type Safety)
  // Garantizamos a TypeScript que dueDate es un objeto Date válido para este punto
  const formattedTasks = dbTasks.map(task => ({
    id: task.id,
    title: task.title,
    status: task.status,
    priority: task.priority,
    dueDate: task.dueDate as Date, 
    projectName: task.project.name
  }));

  // 4. RENDERIZADO DEL ESQUELETO
  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 space-y-6">
      <div className="border-b border-slate-200 pb-5">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
          <CalendarDays className="w-8 h-8 text-blue-600" /> Calendario de Entregas
        </h1>
        <p className="text-slate-500 mt-1">
          Visualiza los plazos y fechas límite de todas las tareas en este espacio de trabajo.
        </p>
      </div>

      {/* Contenedor principal para la cuadrícula que crearemos */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden min-h-[600px]">
        <CalendarGrid tasks={formattedTasks} />
      </div>
    </div>
  );
}