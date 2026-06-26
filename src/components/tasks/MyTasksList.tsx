"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Circle, Clock, FolderKanban } from "lucide-react";
import { updateTaskStatus } from "@/actions/task.actions";

// Tipo estricto de la estructura enriquecida que nos mandará el servidor
export interface MyTaskItem {
  id: string;
  title: string;
  status: "TODO" | "IN_PROGRESS" | "IN_REVIEW" | "DONE";
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  dueDate: Date | null;
  project: {
    name: string;
  };
}

interface MyTasksListProps {
  initialTasks: MyTaskItem[];
}

export function MyTasksList({ initialTasks }: MyTasksListProps) {
  // 1. Estado local para la Interfaz Optimista
  const [tasks, setTasks] = useState<MyTaskItem[]>(initialTasks);

  // Sincronización con el servidor
  useEffect(() => {
    setTasks(initialTasks);
  }, [initialTasks]);

  // 2. Función de actualización instantánea
  const handleToggleStatus = async (taskId: string, currentStatus: string) => {
    // Si ya está terminada, la devolvemos a "Por Hacer", de lo contrario, la marcamos como "Terminada"
    const newStatus = currentStatus === "DONE" ? "TODO" : "DONE";

    // ¡Magia Visual! Actualizamos la pantalla de inmediato sin esperar al servidor
    setTasks((prevTasks) => 
      prevTasks.map((t) => 
        t.id === taskId ? { ...t, status: newStatus } : t
      )
    );

    // Ejecución silenciosa en el backend
    const result = await updateTaskStatus(taskId, newStatus);

    // Sistema de auto-curación: Si PostgreSQL falla, revertimos al estado original para evitar datos fantasma
    if (result?.error) {
      setTasks(initialTasks);
    }
  };

  // 3. Agrupación matemática en tiempo real
  const pendingTasks = tasks.filter((t) => t.status !== "DONE");
  const completedTasks = tasks.filter((t) => t.status === "DONE");

  // Paleta de colores para prioridades
  const priorityColors = {
    LOW: "bg-slate-100 text-slate-700",
    MEDIUM: "bg-blue-100 text-blue-700",
    HIGH: "bg-amber-100 text-amber-700",
    URGENT: "bg-red-100 text-red-700 animate-pulse",
  };

  // Sub-componente interno para renderizar cada fila (Reutilización de código)
  const TaskRow = ({ task }: { task: MyTaskItem }) => {
    const isCompleted = task.status === "DONE";

    return (
      <Card className={`mb-3 transition-all ${isCompleted ? 'bg-slate-50/50 opacity-60' : 'bg-white hover:shadow-md border-slate-200'}`}>
        <CardContent className="p-4 flex items-center gap-4">
          
          {/* Botón interactivo de Check */}
          <button 
            onClick={() => handleToggleStatus(task.id, task.status)}
            className="shrink-0 text-slate-400 hover:text-emerald-500 transition-colors"
          >
            {isCompleted ? (
              <CheckCircle2 className="w-6 h-6 text-emerald-500" />
            ) : (
              <Circle className="w-6 h-6" />
            )}
          </button>

          {/* Información de la Tarea */}
          <div className="flex-1 min-w-0">
            <h3 className={`font-semibold text-sm truncate ${isCompleted ? 'text-slate-500 line-through' : 'text-slate-800'}`}>
              {task.title}
            </h3>
            <div className="flex items-center gap-3 mt-1.5 flex-wrap">
              <div className="flex items-center gap-1 text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                <FolderKanban className="w-3 h-3" />
                <span className="truncate max-w-[120px]">{task.project.name}</span>
              </div>
              
              {!isCompleted && (
                <Badge variant="outline" className={`${priorityColors[task.priority]} text-[10px] uppercase border-none px-1.5 py-0`}>
                  {task.priority}
                </Badge>
              )}
            </div>
          </div>

          {/* Fecha Límite */}
          {task.dueDate && !isCompleted && (
            <div className="hidden sm:flex shrink-0 items-center gap-1.5 text-xs font-medium text-slate-400 bg-white border border-slate-100 px-2.5 py-1.5 rounded-lg shadow-sm">
              <Clock className="w-3.5 h-3.5 text-blue-500" />
              {new Date(task.dueDate).toLocaleDateString()}
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="mb-8 border-b border-slate-200 pb-5">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Mis Tareas</h1>
        <p className="text-slate-500 mt-1">Tu agenda personal agrupada desde todos los proyectos del equipo.</p>
      </div>

      <div className="space-y-8">
        {/* Sección: Pendientes */}
        <section>
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-4 flex items-center gap-2">
            Por Hacer <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">{pendingTasks.length}</Badge>
          </h2>
          
          {pendingTasks.length === 0 ? (
            <div className="text-center py-10 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-3" />
              <p className="text-slate-600 font-medium">¡Estás al día!</p>
              <p className="text-slate-400 text-sm mt-1">No tienes tareas pendientes asignadas a ti en este momento.</p>
            </div>
          ) : (
            pendingTasks.map(task => <TaskRow key={task.id} task={task} />)
          )}
        </section>

        {/* Sección: Completadas */}
        {completedTasks.length > 0 && (
          <section className="pt-4">
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              Completadas <Badge variant="outline" className="text-slate-400 border-slate-200">{completedTasks.length}</Badge>
            </h2>
            <div className="opacity-75">
              {completedTasks.map(task => <TaskRow key={task.id} task={task} />)}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}