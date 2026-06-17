import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Circle, Clock, MoreHorizontal, Plus } from "lucide-react";

export default function MyTasksPage() {
  // Simulamos datos reales basados en la siembra que hicimos en la base de datos
  const tasks = [
    { 
      id: 1, 
      title: "Diseñar esquema de base de datos relacional", 
      project: "Predicción de Demanda - Olist", 
      status: "IN_PROGRESS", 
      priority: "Urgente", 
      date: "Hoy" 
    },
    { 
      id: 2, 
      title: "Entrenar modelo base de regresión", 
      project: "Predicción de Demanda - Olist", 
      status: "TODO", 
      priority: "Media", 
      date: "Mañana" 
    },
    { 
      id: 3, 
      title: "Extraer y limpiar el dataset de Olist", 
      project: "Predicción de Demanda - Olist", 
      status: "DONE", 
      priority: "Alta", 
      date: "Completado" 
    },
  ];

  return (
    <div className="max-w-5xl mx-auto py-8">
      {/* Cabecera */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Mis Tareas</h1>
          <p className="text-slate-500 mt-2">Gestiona tus asignaciones personales en todos los espacios de trabajo.</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 gap-2">
          <Plus className="w-4 h-4" /> Nueva Tarea
        </Button>
      </div>

      {/* Lista de Tareas */}
      <Card className="shadow-sm border-slate-200 overflow-hidden">
        <div className="divide-y divide-slate-100">
          {tasks.map((task) => (
            <div key={task.id} className="p-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between hover:bg-slate-50 transition-colors group gap-4">
              
              {/* Información de la tarea */}
              <div className="flex items-start sm:items-center gap-4">
                <div className="mt-1 sm:mt-0">
                  {task.status === "DONE" ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  ) : task.status === "IN_PROGRESS" ? (
                    <Clock className="w-5 h-5 text-amber-500" />
                  ) : (
                    <Circle className="w-5 h-5 text-slate-300" />
                  )}
                </div>
                <div>
                  <h3 className={`font-medium ${task.status === 'DONE' ? 'text-slate-400 line-through' : 'text-slate-900'}`}>
                    {task.title}
                  </h3>
                  <span className="text-xs text-slate-500">{task.project}</span>
                </div>
              </div>
              
              {/* Metadatos y Acciones */}
              <div className="flex items-center gap-4 sm:gap-6 ml-9 sm:ml-0">
                <Badge variant="outline" className={`
                  ${task.priority === 'Urgente' ? 'text-red-600 border-red-200 bg-red-50' : ''}
                  ${task.priority === 'Alta' ? 'text-orange-600 border-orange-200 bg-orange-50' : ''}
                  ${task.priority === 'Media' ? 'text-blue-600 border-blue-200 bg-blue-50' : ''}
                `}>
                  {task.priority}
                </Badge>
                <span className="text-sm font-medium text-slate-500 w-20 text-left sm:text-right">
                  {task.date}
                </span>
                <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreHorizontal className="w-4 h-4 text-slate-400" />
                </Button>
              </div>

            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}