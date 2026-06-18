"use client";

import { useState, useEffect, type CSSProperties } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

// 1. Nuestros datos semilla estructurados para Drag & Drop
const initialData = {
  tasks: {
    "task-1": { id: "task-1", title: "Entrenar modelo base de regresión", priority: "Media", dep: "DATA SCIENCE", color: "text-blue-600" },
    "task-2": { id: "task-2", title: "Diseñar esquema relacional", priority: "Urgente", dep: "DATABASE", color: "text-amber-600" },
    "task-3": { id: "task-3", title: "Extraer y limpiar dataset de Olist", priority: "Alta", dep: "DATA ENG", color: "text-emerald-600" },
  },
  columns: {
    "TODO": { id: "TODO", title: "Por Hacer", taskIds: ["task-1"] },
    "IN_PROGRESS": { id: "IN_PROGRESS", title: "En Progreso", taskIds: ["task-2"] },
    "DONE": { id: "DONE", title: "Completado", taskIds: ["task-3"] },
  },
  columnOrder: ["TODO", "IN_PROGRESS", "DONE"],
};

export default function DashboardPage() {
  const [data, setData] = useState(initialData);
  const [isMounted, setIsMounted] = useState(false);

  // Truco Senior: Prevenir errores de hidratación en Next.js
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // 2. La lógica del motor de física al soltar la tarjeta
  const onDragEnd = (result: any) => {
    const { destination, source, draggableId } = result;

    // Si la soltó fuera del tablero, no hacemos nada
    if (!destination) return;

    // Si la soltó exactamente en el mismo lugar, no hacemos nada
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const startColumn = data.columns[source.droppableId as keyof typeof data.columns];
    const finishColumn = data.columns[destination.droppableId as keyof typeof data.columns];

    // Movimiento dentro de la misma columna
    if (startColumn === finishColumn) {
      const newTaskIds = Array.from(startColumn.taskIds);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);

      const newColumn = { ...startColumn, taskIds: newTaskIds };
      setData({ ...data, columns: { ...data.columns, [newColumn.id]: newColumn } });
      return;
    }

    // Movimiento de una columna a otra
    const startTaskIds = Array.from(startColumn.taskIds);
    startTaskIds.splice(source.index, 1);
    const newStart = { ...startColumn, taskIds: startTaskIds };

    const finishTaskIds = Array.from(finishColumn.taskIds);
    finishTaskIds.splice(destination.index, 0, draggableId);
    const newFinish = { ...finishColumn, taskIds: finishTaskIds };

    setData({ ...data, columns: { ...data.columns, [newStart.id]: newStart, [newFinish.id]: newFinish } });
  };

  // Evitamos renderizar hasta que el cliente esté montado (Regla de oro de DnD en Next.js)
  if (!isMounted) return null;

  return (
    <div className="space-y-6 flex flex-col h-full">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Predicción de Demanda - Olist</h1>
        <p className="text-slate-500 mt-2">Tablero interactivo de progreso del proyecto</p>
      </div>

      {/* 3. El Contexto que envuelve todo el tablero */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start flex-1">
          
          {data.columnOrder.map((columnId) => {
            const column = data.columns[columnId as keyof typeof data.columns];
            const tasks = column.taskIds.map((taskId) => data.tasks[taskId as keyof typeof data.tasks]);

            return (
              <div key={column.id} className="bg-slate-100 p-4 rounded-xl flex flex-col min-h-[500px]">
                <h3 className="font-semibold text-slate-700 mb-4 flex items-center justify-between">
                  {column.title} 
                  <span className="bg-slate-200 text-xs px-2 py-1 rounded-full">{tasks.length}</span>
                </h3>

                {/* 4. La Zona Soltable (Columna) */}
                <Droppable droppableId={column.id}>
                  {(provided, snapshot) => (
                    <div 
                      ref={provided.innerRef} 
                      {...provided.droppableProps}
                      className={`flex-1 transition-colors rounded-lg ${snapshot.isDraggingOver ? 'bg-slate-200/50' : ''}`}
                    >
                      {tasks.map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="mb-3"
                              style={{ ...provided.draggableProps.style }}
                            >
                              <Card className={`shadow-sm border-slate-200 cursor-grab active:cursor-grabbing hover:border-blue-300 transition-colors ${snapshot.isDragging ? 'shadow-lg ring-2 ring-blue-500 ring-opacity-50 rotate-2' : ''}`}>
                                <CardHeader className="p-4 pb-2">
                                  <div className={`text-xs font-bold ${task.color} mb-1 tracking-wider`}>{task.dep}</div>
                                  <CardTitle className={`text-sm font-medium leading-snug ${column.id === 'DONE' ? 'line-through text-slate-400' : 'text-slate-700'}`}>
                                    {task.title}
                                  </CardTitle>
                                </CardHeader>
                                <CardContent className="p-4 pt-0 flex justify-between items-end mt-4">
                                  <Badge variant="outline" className={
                                    task.priority === 'Urgente' ? 'text-red-600 border-red-200 bg-red-50' : 
                                    task.priority === 'Alta' ? 'text-orange-600 border-orange-200 bg-orange-50' : 'text-slate-500'
                                  }>
                                    {task.priority}
                                  </Badge>
                                  <Avatar className="w-7 h-7 border-2 border-white shadow-sm"><AvatarFallback className="text-[10px] bg-slate-100 font-medium text-slate-700">CC</AvatarFallback></Avatar>
                                </CardContent>
                              </Card>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
          
        </div>
      </DragDropContext>
    </div>
  );
}