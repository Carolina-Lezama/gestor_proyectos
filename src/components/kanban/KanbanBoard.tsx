"use client";

import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { CreateTaskInput } from "./CreateTaskInput";
import { TaskCard } from "./TaskCard";
import { CheckCircle2, Circle, HelpCircle, Activity } from "lucide-react";
import { updateTasksOrder } from "@/actions/task.actions";

interface TaskItem {
  id: string;
  title: string;
  description: string | null;
  status: "TODO" | "IN_PROGRESS" | "IN_REVIEW" | "DONE";
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  dueDate: Date | null;
  position: number;
}

interface GroupedTasks {
  TODO: TaskItem[];
  IN_PROGRESS: TaskItem[];
  IN_REVIEW: TaskItem[];
  DONE: TaskItem[];
}

interface KanbanBoardProps {
  projectId: string;
  groupedTasks: GroupedTasks;
}

export function KanbanBoard({ projectId, groupedTasks }: KanbanBoardProps) {
  // 1. Estado local para mover las tarjetas sin esperar al servidor
  const [boardTasks, setBoardTasks] = useState<GroupedTasks>(groupedTasks);
  
  // 2. Prevenir errores de Hydration en Next.js (SSR)
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
    setBoardTasks(groupedTasks);
  }, [groupedTasks]);

  const columns = [
    { id: "TODO", title: "Por Hacer", icon: Circle, color: "text-slate-400 bg-slate-100" },
    { id: "IN_PROGRESS", title: "En Progreso", icon: Activity, color: "text-blue-500 bg-blue-50" },
    { id: "IN_REVIEW", title: "En Revisión", icon: HelpCircle, color: "text-purple-500 bg-purple-50" },
    { id: "DONE", title: "Terminado", icon: CheckCircle2, color: "text-emerald-500 bg-emerald-50" },
  ] as const;

  // 3. El motor de físicas: ¿Qué pasa cuando soltamos la tarjeta?
  const onDragEnd = async (result: DropResult) => {
    const { source, destination } = result;

    // Si soltó la tarjeta fuera de una columna, no hacemos nada
    if (!destination) return;
    
    // Si la soltó exactamente en el mismo lugar donde empezó, no hacemos nada
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    const sourceStatus = source.droppableId as keyof GroupedTasks;
    const destStatus = destination.droppableId as keyof GroupedTasks;

    // Clonamos el estado actual para mutarlo con seguridad
    const newBoard = { ...boardTasks };
    const sourceList = [...newBoard[sourceStatus]];
    const destList = sourceStatus === destStatus ? sourceList : [...newBoard[destStatus]];

    // Extraemos la tarjeta de la lista de origen
    const [movedTask] = sourceList.splice(source.index, 1);
    movedTask.status = destStatus; // Actualizamos su status por si cambió de columna

    // La inyectamos en la lista de destino en el índice exacto
    destList.splice(destination.index, 0, movedTask);

    // Guardamos las listas modificadas
    newBoard[sourceStatus] = sourceList;
    newBoard[destStatus] = destList;
    
    // ¡Optimistic UI! Actualizamos la pantalla de inmediato (sin esperar a Prisma)
    setBoardTasks(newBoard);

    // 4. Preparamos los datos matemáticos para el servidor
    const tasksToUpdate: { id: string; status: any; position: number }[] = [];

    // Recalculamos la posición para todas las tareas de la columna de destino
    destList.forEach((task, index) => {
      tasksToUpdate.push({ id: task.id, status: destStatus, position: index });
    });

    // Si la tarjeta cambió de columna, también debemos recalcular la de origen
    if (sourceStatus !== destStatus) {
      sourceList.forEach((task, index) => {
        tasksToUpdate.push({ id: task.id, status: sourceStatus, position: index });
      });
    }

    // Enviamos el payload al Server Action en segundo plano
    await updateTasksOrder(tasksToUpdate);
  };

  // Si Next.js aún no ha montado el cliente, devolvemos null temporalmente
  if (!isMounted) return null; 

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-start h-[calc(100vh-220px)] overflow-x-auto pb-4">
        {columns.map((column) => {
          const tasks = boardTasks[column.id] || [];
          const Icon = column.icon;

          return (
            <div key={column.id} className="bg-slate-50/80 rounded-xl border border-slate-200/60 p-4 flex flex-col max-h-full w-full min-w-[250px]">
              
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

              {/* Zona que recibe las tarjetas (Droppable) */}
              <Droppable droppableId={column.id}>
                {(provided, snapshot) => (
                  <div 
                    ref={provided.innerRef} 
                    {...provided.droppableProps}
                    className={`flex-1 overflow-y-auto space-y-3 pr-1 scrollbar-thin min-h-[150px] transition-colors rounded-lg ${
                      snapshot.isDraggingOver ? 'bg-slate-100/50' : ''
                    }`}
                  >
                    {tasks.map((task, index) => (
                      /* Las tarjetas que se pueden arrastrar (Draggable) */
                      <Draggable key={task.id} draggableId={task.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={{
                              ...provided.draggableProps.style,
                              // Pequeño efecto visual al levantar la tarjeta
                              opacity: snapshot.isDragging ? 0.8 : 1,
                              transform: snapshot.isDragging ? `${provided.draggableProps.style?.transform} scale(1.02)` : provided.draggableProps.style?.transform,
                            }}
                          >
                            <TaskCard task={task} />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {/* Placeholder obligatorio para mantener las dimensiones al arrastrar */}
                    {provided.placeholder}
                    
                    {tasks.length === 0 && !snapshot.isDraggingOver && (
                      <div className="text-center py-8 border-2 border-dashed border-slate-200 rounded-lg bg-white/50 m-1">
                        <p className="text-[11px] font-medium text-slate-400">Suelta una tarea aquí</p>
                      </div>
                    )}
                  </div>
                )}
              </Droppable>

              <CreateTaskInput projectId={projectId} status={column.id} />
            </div>
          );
        })}
      </div>
    </DragDropContext>
  );
}