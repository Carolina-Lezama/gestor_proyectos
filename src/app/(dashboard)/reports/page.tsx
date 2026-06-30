import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FolderKanban, CheckCircle2, TrendingUp, AlertCircle, BarChart3 } from "lucide-react";
import { TaskStatusPieChart } from "@/components/reports/TaskStatusPieChart";
import { PriorityBarChart } from "@/components/reports/PriorityBarChart";
import { ProjectWorkloadChart } from "@/components/reports/ProjectWorkloadChart";

interface ReportsPageProps {
  searchParams: Promise<{
    workspaceId?: string;
  }>;
}

export default async function ReportsPage({ searchParams }: ReportsPageProps) {
  // 1. SEGURIDAD Y CONTEXTO
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const params = await searchParams;
  let activeWorkspaceId = params.workspaceId;

  // LECTURA DE COOKIE (Memoria)
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

  // FALLBACK ABSOLUTO
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
            No tienes un equipo activo para generar reportes analíticos.
          </p>
        </div>
      );
    }
  }

  // 2. PIPELINE DE EXTRACCIÓN DE DATOS (Agregaciones de PostgreSQL)
  
  // Total de proyectos en este Workspace
  const totalProjects = await prisma.project.count({
    where: { workspaceId: activeWorkspaceId }
  });

  // Agregación: Conteo de tareas agrupadas por Estado
  const tasksByStatus = await prisma.task.groupBy({
    by: ['status'],
    where: { project: { workspaceId: activeWorkspaceId } },
    _count: { id: true }
  });

  // Agregación: Conteo de tareas agrupadas por Prioridad
  const tasksByPriority = await prisma.task.groupBy({
    by: ['priority'],
    where: { project: { workspaceId: activeWorkspaceId } },
    _count: { id: true }
  });

  // Carga de trabajo por Proyecto
  const projectsWorkload = await prisma.project.findMany({
    where: { workspaceId: activeWorkspaceId },
    select: {
      name: true,
      _count: { select: { tasks: true } }
    }
  });

  // 3. TRANSFORMACIÓN DE DATOS (Preparación para Recharts)
  
  // KPIs Generales calculados en el servidor de Node.js
  const totalTasks = tasksByStatus.reduce((acc, curr) => acc + curr._count.id, 0);
  const completedTasks = tasksByStatus.find(t => t.status === "DONE")?._count.id || 0;
  const completionRate = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  // Arrays formateados exactamente como Recharts los necesita
  const formattedStatusData = tasksByStatus.map(t => ({
    name: t.status === "TODO" ? "Por Hacer" : t.status === "IN_PROGRESS" ? "En Progreso" : t.status === "IN_REVIEW" ? "En Revisión" : "Completadas",
    value: t._count.id,
    fill: t.status === "TODO" ? "#94a3b8" : t.status === "IN_PROGRESS" ? "#3b82f6" : t.status === "IN_REVIEW" ? "#a855f7" : "#10b981"
  }));

  const formattedPriorityData = tasksByPriority.map(t => ({
    name: t.priority,
    value: t._count.id,
    fill: t.priority === "LOW" ? "#cbd5e1" : t.priority === "MEDIUM" ? "#60a5fa" : t.priority === "HIGH" ? "#fbbf24" : "#ef4444"
  }));

  const formattedProjectData = projectsWorkload.map(p => ({
    name: p.name,
    tareas: p._count.tasks
  }));

  // 4. RENDERIZADO DEL ESQUELETO Y KPIs
  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 space-y-8">
      {/* Encabezado */}
      <div className="border-b border-slate-200 pb-5">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
          <BarChart3 className="w-8 h-8 text-blue-600" /> Rendimiento del Equipo
        </h1>
        <p className="text-slate-500 mt-1">Visión general analítica de todas las tareas y proyectos en el espacio activo.</p>
      </div>

      {/* Fila 1: Tarjetas de KPI (Key Performance Indicators) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Proyectos Activos</CardTitle>
            <FolderKanban className="w-4 h-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{totalProjects}</div>
            <p className="text-xs text-slate-500 mt-1">En el espacio de trabajo actual</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Velocidad de Cierre</CardTitle>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{completionRate}%</div>
            <p className="text-xs text-slate-500 mt-1">
              {completedTasks} de {totalTasks} tareas completadas
            </p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Volumen Total</CardTitle>
            <TrendingUp className="w-4 h-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{totalTasks}</div>
            <p className="text-xs text-slate-500 mt-1">Tareas registradas históricamente</p>
          </CardContent>
        </Card>
      </div>

{/* Fila 2: Contenedores de Gráficos (Listos para recibir los Client Components) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-slate-200 shadow-sm min-h-[400px]">
          <CardHeader>
            <CardTitle className="text-base text-slate-800">Distribución por Estado</CardTitle>
          </CardHeader>
          {/* Aumentamos el alto para dar espacio a la leyenda y el gráfico */}
          <CardContent className="h-[320px]">
            <TaskStatusPieChart data={formattedStatusData} />
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm min-h-[400px]">
          <CardHeader>
            <CardTitle className="text-base text-slate-800">Carga por Prioridad</CardTitle>
          </CardHeader>
          <CardContent className="h-[320px]">
            <PriorityBarChart data={formattedPriorityData} />
          </CardContent>
        </Card>
      </div>
      {/* Fila 3: Gráfico Panorámico (Ancho completo) */}
      <div className="mt-6">
        <Card className="border-slate-200 shadow-sm min-h-[400px]">
          <CardHeader>
            <CardTitle className="text-base text-slate-800">Carga de Trabajo por Proyecto</CardTitle>
          </CardHeader>
          <CardContent className="h-[320px]">
            <ProjectWorkloadChart data={formattedProjectData} />
          </CardContent>
        </Card>
      </div>
      
    </div>
  );
}