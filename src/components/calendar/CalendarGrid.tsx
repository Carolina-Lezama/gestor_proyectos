"use client";

import { useState } from "react";
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  isSameMonth, 
  isSameDay, 
  addDays,
  parseISO
} from "date-fns";
import { es } from "date-fns/locale"; // Importamos el idioma español
import { ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Interfaz estricta de las tareas que inyecta el servidor
interface CalendarTask {
  id: string;
  title: string;
  status: "TODO" | "IN_PROGRESS" | "IN_REVIEW" | "DONE";
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  dueDate: Date;
  projectName: string;
}

interface CalendarGridProps {
  tasks: CalendarTask[];
}

export function CalendarGrid({ tasks }: CalendarGridProps) {
  // Estado local para saber qué mes estamos viendo (inicia en el mes actual real)
  const [currentDate, setCurrentDate] = useState(new Date());

  // 1. Funciones de Navegación del Mes
  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const today = () => setCurrentDate(new Date());

  // 2. Construcción de la Cuadrícula Matemática
  // Tomamos el primer y último día del mes actual
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  
  // Para que la cuadrícula cuadre (domingo a sábado), tomamos el inicio de la primera semana
  // y el final de la última semana. Esto genera "días de relleno" de los meses adyacentes.
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 }); // Empezamos la semana en Lunes
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

  // 3. Generación del Arreglo de Días
  const calendarDays = [];
  let day = startDate;
  while (day <= endDate) {
    calendarDays.push(day);
    day = addDays(day, 1);
  }

  // Paleta visual para los estados y prioridades
  const statusColors = {
    TODO: "bg-slate-100 text-slate-600 border-slate-200",
    IN_PROGRESS: "bg-blue-50 text-blue-700 border-blue-200",
    IN_REVIEW: "bg-purple-50 text-purple-700 border-purple-200",
    DONE: "bg-emerald-50 text-emerald-700 border-emerald-200 opacity-60",
  };

  const priorityIndicators = {
    LOW: "bg-slate-300",
    MEDIUM: "bg-blue-400",
    HIGH: "bg-amber-400",
    URGENT: "bg-red-500 animate-pulse",
  };

  return (
    <div className="flex flex-col h-full bg-white">
      
      {/* --- CABECERA DE NAVEGACIÓN --- */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
        <h2 className="text-xl font-bold text-slate-800 capitalize">
          {format(currentDate, "MMMM yyyy", { locale: es })}
        </h2>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={today}
            className="px-3 py-1.5 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors mr-2"
          >
            Hoy
          </button>
          <div className="flex bg-slate-50 border border-slate-200 rounded-lg overflow-hidden">
            <button 
              onClick={prevMonth}
              className="p-1.5 text-slate-500 hover:bg-slate-200 hover:text-slate-700 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="w-px bg-slate-200"></div>
            <button 
              onClick={nextMonth}
              className="p-1.5 text-slate-500 hover:bg-slate-200 hover:text-slate-700 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* --- NOMBRES DE LOS DÍAS --- */}
      <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50/50">
        {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map(dayName => (
          <div key={dayName} className="py-2.5 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">
            {dayName}
          </div>
        ))}
      </div>

      {/* --- MATRIZ DE DÍAS (CUADRÍCULA) --- */}
      <div className="flex-1 grid grid-cols-7 auto-rows-[minmax(120px,1fr)] bg-slate-200 gap-px">
        {calendarDays.map((dateString, i) => {
          // Buscamos matemáticamente qué tareas caen exactamente en este día
          const dayTasks = tasks.filter(task => isSameDay(task.dueDate, dateString));
          
          // Estilos condicionales dependiendo de si es el mes actual y si es hoy
          const isCurrentMonth = isSameMonth(dateString, monthStart);
          const isToday = isSameDay(dateString, new Date());

          return (
            <div 
              key={i} 
              className={`bg-white min-h-[120px] p-2 transition-colors flex flex-col ${
                !isCurrentMonth ? "bg-slate-50/50 text-slate-400" : "text-slate-700 hover:bg-slate-50/30"
              }`}
            >
              {/* Número del día */}
              <div className="flex justify-between items-start mb-2">
                <span className={`text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full ${
                  isToday ? "bg-blue-600 text-white shadow-sm" : ""
                }`}>
                  {format(dateString, "d")}
                </span>
                
                {/* Contador de entregas para este día (si hay más de 0) */}
                {dayTasks.length > 0 && (
                  <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-1.5 rounded-full">
                    {dayTasks.length}
                  </span>
                )}
              </div>

              {/* Lista de píldoras de tareas */}
              <div className="flex-1 space-y-1.5 overflow-y-auto pr-1 custom-scrollbar">
                {dayTasks.map(task => (
                  <div 
                    key={task.id} 
                    className={`group relative flex items-start gap-1.5 p-1.5 rounded-md border text-xs leading-tight transition-all cursor-default ${statusColors[task.status]}`}
                    title={`${task.title} (${task.projectName})`} // Tooltip nativo
                  >
                    {/* Puntito de color que indica la urgencia */}
                    <div className={`w-1.5 h-1.5 rounded-full mt-1 shrink-0 ${priorityIndicators[task.priority]}`} />
                    
                    <div className="flex-1 min-w-0">
                      <div className={`font-semibold truncate ${task.status === 'DONE' ? 'line-through' : ''}`}>
                        {task.title}
                      </div>
                      <div className="text-[9px] font-medium opacity-70 truncate mt-0.5 uppercase tracking-wide flex items-center gap-1">
                        <Clock className="w-2 h-2" /> {task.projectName}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}