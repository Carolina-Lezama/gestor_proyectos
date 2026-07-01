"use client";

import { useState, useTransition } from "react";
import { format } from "date-fns";
import { 
  X, Calendar, Flag, CheckSquare, MessageSquare, Trash2, Send, AlignLeft, Clock 
} from "lucide-react";
import { Priority } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  updateTaskDetails, createSubtask, toggleSubtask, deleteSubtask, addComment, deleteComment 
} from "@/actions/task.actions";

// Tipado estricto basado en nuestro nuevo esquema
interface TaskModalProps {
  task: any; // Recibirá la tarea con sus subtareas y comentarios anidados
  isOpen: boolean;
  onClose: () => void;
  currentUserId: string;
}

export function TaskDetailModal({ task, isOpen, onClose, currentUserId }: TaskModalProps) {
  const [isPending, startTransition] = useTransition();
  
  // Estados locales para los inputs
  const [description, setDescription] = useState(task?.description || "");
  const [newSubtask, setNewSubtask] = useState("");
  const [newComment, setNewComment] = useState("");

  if (!isOpen || !task) return null;

  // --- MANEJADORES DE ACCIONES ---

  const handleUpdateDetails = (field: "priority" | "dueDate" | "description", value: any) => {
    startTransition(async () => {
      let parsedValue = value;
      // Ajuste de zona horaria para el input de fecha nativo
      if (field === "dueDate" && value) {
        parsedValue = new Date(value + 'T12:00:00'); 
      }
      await updateTaskDetails(task.id, { [field]: parsedValue });
    });
  };

  const handleAddSubtask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubtask.trim()) return;
    startTransition(async () => {
      await createSubtask(task.id, newSubtask);
      setNewSubtask(""); // Limpiamos el input
    });
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    startTransition(async () => {
      await addComment(task.id, newComment);
      setNewComment("");
    });
  };

  // Convertimos la fecha a formato YYYY-MM-DD para el input nativo
  const formattedDueDate = task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : "";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
      {/* Contenedor Principal del Modal */}
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
        
        {/* Cabecera (Header) */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-blue-100 text-blue-700 uppercase tracking-wider">
              {task.status.replace("_", " ")}
            </span>
            <h2 className="text-xl font-bold text-slate-800">{task.title}</h2>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cuerpo del Modal (2 Columnas) */}
        <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
          
          {/* ================= COLUMNA IZQUIERDA: Contexto ================= */}
          <div className="flex-1 overflow-y-auto p-6 border-r border-slate-200 space-y-8 custom-scrollbar">
            
            {/* Descripción */}
            <section className="space-y-3">
              <div className="flex items-center gap-2 text-slate-700 font-semibold">
                <AlignLeft className="w-5 h-5 text-slate-400" /> Descripción
              </div>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                onBlur={(e) => handleUpdateDetails("description", e.target.value)} // Guarda al quitar el foco
                placeholder="Añade detalles más profundos a esta tarea..."
                className="w-full min-h-[120px] p-3 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-y transition-all"
                disabled={isPending}
              />
            </section>

            {/* Subtareas */}
            <section className="space-y-4">
              <div className="flex items-center gap-2 text-slate-700 font-semibold">
                <CheckSquare className="w-5 h-5 text-slate-400" /> Checklist de Subtareas
              </div>
              
              <div className="space-y-2">
                {task.subtasks?.map((subtask: any) => (
                  <div key={subtask.id} className="flex items-center justify-between group p-2 hover:bg-slate-50 rounded-lg border border-transparent hover:border-slate-100 transition-colors">
                    <label className="flex items-center gap-3 cursor-pointer flex-1">
                      <input 
                        type="checkbox" 
                        checked={subtask.isCompleted}
                        onChange={(e) => startTransition(() => toggleSubtask(subtask.id, e.target.checked))}
                        className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
                        disabled={isPending}
                      />
                      <span className={`text-sm ${subtask.isCompleted ? 'line-through text-slate-400' : 'text-slate-700'}`}>
                        {subtask.title}
                      </span>
                    </label>
                    <button 
                      onClick={() => startTransition(() => deleteSubtask(subtask.id))}
                      className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-400 hover:text-red-600 transition-all rounded-md hover:bg-red-50"
                      disabled={isPending}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              <form onSubmit={handleAddSubtask} className="flex items-center gap-2 mt-2">
                <Input 
                  value={newSubtask}
                  onChange={(e) => setNewSubtask(e.target.value)}
                  placeholder="Añadir un elemento..." 
                  className="h-9 text-sm"
                  disabled={isPending}
                />
                <Button type="submit" size="sm" variant="secondary" disabled={isPending || !newSubtask.trim()}>
                  Añadir
                </Button>
              </form>
            </section>
          </div>

          {/* ================= COLUMNA DERECHA: Metadatos y Feed ================= */}
          <div className="w-full md:w-80 bg-slate-50 flex flex-col">
            
            <div className="p-6 space-y-6 flex-1 overflow-y-auto custom-scrollbar">
              
              {/* Prioridad */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                  <Flag className="w-4 h-4" /> Prioridad
                </label>
                <select 
                  value={task.priority}
                  onChange={(e) => handleUpdateDetails("priority", e.target.value)}
                  className="w-full h-10 px-3 text-sm bg-white border border-slate-200 rounded-lg outline-none focus:border-blue-500 cursor-pointer"
                  disabled={isPending}
                >
                  <option value={Priority.LOW}>Baja</option>
                  <option value={Priority.MEDIUM}>Media</option>
                  <option value={Priority.HIGH}>Alta</option>
                  <option value={Priority.URGENT}>Urgente</option>
                </select>
              </div>

              {/* Fecha Límite */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                  <Calendar className="w-4 h-4" /> Fecha Límite
                </label>
                <input 
                  type="date"
                  value={formattedDueDate}
                  onChange={(e) => handleUpdateDetails("dueDate", e.target.value || null)}
                  className="w-full h-10 px-3 text-sm bg-white border border-slate-200 rounded-lg outline-none focus:border-blue-500 cursor-pointer"
                  disabled={isPending}
                />
              </div>

              {/* Chat / Comentarios */}
              <div className="space-y-4 pt-4 border-t border-slate-200">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" /> Actividad
                </label>
                
                <div className="space-y-4">
                  {task.comments?.length === 0 && (
                    <p className="text-xs text-slate-400 text-center italic">No hay comentarios aún.</p>
                  )}
                  {task.comments?.map((comment: any) => (
                    <div key={comment.id} className="flex gap-3 text-sm">
                      <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold shrink-0 text-xs">
                        {comment.user?.name?.charAt(0) || "U"}
                      </div>
                      <div className="flex-1 bg-white p-3 rounded-lg border border-slate-200 shadow-sm relative group">
                        <div className="flex justify-between items-start mb-1">
                          <span className="font-semibold text-slate-800">{comment.user?.name || "Usuario"}</span>
                          <span className="text-[10px] text-slate-400">{format(new Date(comment.createdAt), "dd MMM, HH:mm")}</span>
                        </div>
                        <p className="text-slate-600 leading-relaxed">{comment.content}</p>
                        
                        {/* Botón borrar (solo visible si el usuario es el autor) */}
                        {comment.userId === currentUserId && (
                          <button 
                            onClick={() => startTransition(() => deleteComment(comment.id))}
                            className="absolute -top-2 -right-2 bg-red-100 text-red-600 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-red-200"
                            title="Eliminar comentario"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Input de Nuevo Comentario (Fijo al fondo) */}
            <div className="p-4 bg-slate-100 border-t border-slate-200">
              <form onSubmit={handleAddComment} className="flex items-center gap-2">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Escribe un comentario..."
                  className="flex-1 h-10 px-3 text-sm rounded-lg border border-slate-300 focus:outline-none focus:border-blue-500"
                  disabled={isPending}
                />
                <Button type="submit" size="icon" className="h-10 w-10 shrink-0 bg-blue-600 hover:bg-blue-700" disabled={isPending || !newComment.trim()}>
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}