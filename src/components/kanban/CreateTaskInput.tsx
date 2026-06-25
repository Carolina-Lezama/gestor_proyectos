"use client";

import { useState, useRef, useEffect } from "react";
import { Plus, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createTask } from "@/actions/task.actions";

interface CreateTaskInputProps {
  projectId: string;
  status: "TODO" | "IN_PROGRESS" | "IN_REVIEW" | "DONE";
}

export function CreateTaskInput({ projectId, status }: CreateTaskInputProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  // Cerrar con la tecla Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsEditing(false);
    };
    if (isEditing) window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isEditing]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    // Inyectamos los datos silenciosos que la base de datos necesita
    formData.append("projectId", projectId);
    formData.append("status", status);

    const result = await createTask(formData);

    if (result?.success) {
      // Si fue exitoso, cerramos el formulario (la tarea ya aparecerá en la columna)
      setIsEditing(false);
    }
    
    setLoading(false);
  }

  // Estado 2: Modo Edición (Formulario)
  if (isEditing) {
    return (
      <form 
        ref={formRef} 
        onSubmit={handleSubmit} 
        className="mt-3 p-2 bg-white rounded-lg border border-blue-300 shadow-sm space-y-2 animate-in fade-in duration-200"
      >
        <input
          name="title"
          autoFocus
          placeholder="¿Qué hay que hacer?"
          className="w-full text-sm font-medium text-slate-800 outline-none placeholder:text-slate-400 bg-transparent px-1"
          disabled={loading}
          required
          autoComplete="off"
        />
        <div className="flex items-center justify-end gap-1">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setIsEditing(false)}
            disabled={loading}
            className="h-7 w-7 p-0 text-slate-400 hover:text-slate-600 rounded-md"
          >
            <X className="w-4 h-4" />
          </Button>
          <Button
            type="submit"
            size="sm"
            disabled={loading}
            className="h-7 px-3 bg-blue-600 hover:bg-blue-700 text-xs font-semibold rounded-md shadow-sm"
          >
            {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Añadir"}
          </Button>
        </div>
      </form>
    );
  }

  // Estado 1: Modo Reposo (Botón)
  return (
    <Button
      variant="ghost"
      onClick={() => setIsEditing(true)}
      className="mt-3 w-full justify-start text-xs font-semibold text-slate-500 hover:text-blue-600 hover:bg-blue-50/50 gap-2 h-9"
    >
      <Plus className="w-3.5 h-3.5" /> Añadir tarea
    </Button>
  );
}