"use client";

import { TaskCard } from "./TaskCard";
import { Plus, CheckCircle2, Circle, HelpCircle, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CreateTaskInput } from "./CreateTaskInput"; // <-- 1. Añade esta importación

// Definimos la estructura de los datos agrupados que vienen del servidor
interface KanbanBoardProps {
  projectId: string;
  groupedTasks: {
    TODO: any[];
    IN_PROGRESS: any[];
    IN_REVIEW: any[];
    DONE: any[];
  };
}

export function KanbanBoard({ projectId, groupedTasks }: KanbanBoardProps) {
  
  // Configuración visual estricta para cada columna del Enum TaskStatus
  const columns = [
    { id: "TODO", title: "Por Hacer", icon: Circle, color: "text-slate-400 bg-slate-100" },
    { id: "IN_PROGRESS", title: "En Progreso", icon: Activity, color: "text-blue-500 bg-blue-50" },
    { id: "IN_REVIEW", title: "En Revisión", icon: HelpCircle, color: "text-purple-500 bg-purple-50" },
    { id: "DONE", title: "Terminado", icon: CheckCircle2, color: "text-emerald-500 bg-emerald-50" },
  ] as const;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-start h-[calc(100vh-220px)] overflow-x-auto pb-4">
      {columns.map((column) => {
        const tasks = groupedTasks[column.id] || [];
        const Icon = column.icon;

        return (
          <div key={column.id} className="bg-slate-50/80 rounded-xl border border-slate-200/60 p-4 flex flex-col max-h-full w-full min-w-[250px]">
            
            {/* Encabezado de la Columna */}
            <div className="flex items-center justify-between mb-4 px-1">
              <div className="flex items-center gap-2">
                <div className={`p-1 rounded-md ${column.color}`}>
                  <Icon className="w-4 h-4 shrink-0" />
                </div>
                <h3 className="font-bold text-slate-800 text-sm tracking-tight">{column.title}</h3>
              </div>
              <span className="text-xs font-bold text-slate-400 bg-white border border-slate-200 px-2 py-0.5 rounded-full shadow-sm">
                {tasks.length}
              </span>
            </div>

            {/* Contenedor de las Tarjetas */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1 scrollbar-thin">
              {tasks.length === 0 ? (
                <div className="text-center py-8 border-2 border-dashed border-slate-200 rounded-lg bg-white/50">
                  <p className="text-[11px] font-medium text-slate-400">Sin tareas en esta etapa</p>
                </div>
              ) : (
                tasks.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))
              )}
            </div>

{/* Componente inteligente para crear tareas en esta columna específica */}
            <CreateTaskInput 
              projectId={projectId} 
              status={column.id} 
            />
          </div>
        );
      })}
    </div>
  );
}