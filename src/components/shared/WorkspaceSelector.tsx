"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState } from "react";
import { setActiveWorkspaceCookie } from "@/actions/workspace.actions";
import { Loader2 } from "lucide-react";

interface WorkspaceSelectorProps {
  workspaces: {
    workspace: {
      id: string;
      name: string;
    };
  }[];
}

export function WorkspaceSelector({ workspaces }: WorkspaceSelectorProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname(); // En qué ruta/pestaña está el usuario parado
  
  const [isChanging, setIsChanging] = useState(false);

  // Leemos el ID activo de la URL
  const activeWorkspaceId = searchParams.get("workspaceId");

  // Buscamos el objeto del workspace activo para pintar sus iniciales
  const activeWorkspace = workspaces.find(w => w.workspace.id === activeWorkspaceId)?.workspace;

  const handleWorkspaceChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    if (!selectedId) return;

    setIsChanging(true);

    // 1. Guardamos la selección en una cookie de servidor de forma silenciosa
    await setActiveWorkspaceCookie(selectedId);

    // 2. Navegamos inteligentemente sin perder la pestaña actual
    // Nota: Eliminamos deliberadamente el 'projectId' de la URL ya que cambiamos de equipo 
    // y los proyectos viejos no existen en el nuevo entorno.
    router.push(`${pathname}?workspaceId=${selectedId}`);
    
    setIsChanging(false);
  };

  if (workspaces.length === 0) {
    return (
      <div className="text-sm font-medium text-slate-400">Sin espacios de trabajo</div>
    );
  }

  return (
    <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 shadow-sm hover:border-slate-300 transition-colors relative max-w-xs">
      
      {/* Avatar dinámico o indicador de carga */}
      <div className="w-7 h-7 bg-indigo-600 rounded-md flex items-center justify-center text-white font-bold text-xs shrink-0 select-none">
        {isChanging ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          (activeWorkspace?.name || workspaces[0].workspace.name).substring(0, 2).toUpperCase()
        )}
      </div>

      <div className="flex flex-col pr-6">
        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider leading-none mb-0.5">Espacio Activo</span>
        <select
          value={activeWorkspaceId || workspaces[0].workspace.id}
          onChange={handleWorkspaceChange}
          disabled={isChanging}
          className="bg-transparent text-sm font-semibold text-slate-700 outline-none cursor-pointer appearance-none pr-4 w-full disabled:opacity-50"
        >
          {!activeWorkspaceId && (
            <option value="" disabled>Selecciona un equipo...</option>
          )}
          {workspaces.map((item) => (
            <option key={item.workspace.id} value={item.workspace.id}>
              {item.workspace.name}
            </option>
          ))}
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">
          ▼
        </div>
      </div>
    </div>
  );
}