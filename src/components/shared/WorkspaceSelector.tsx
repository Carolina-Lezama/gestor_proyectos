"use client";

import { useRouter, useSearchParams } from "next/navigation";

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
  
  // 1. Leemos el ID activo de la URL
  const activeWorkspaceId = searchParams.get("workspaceId");

  // 2. Buscamos el objeto del workspace activo para pintar sus iniciales
  const activeWorkspace = workspaces.find(w => w.workspace.id === activeWorkspaceId)?.workspace;

  // 3. Cuando el usuario cambia de opción, actualizamos la URL
  const handleWorkspaceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    if (selectedId) {
      router.push(`/dashboard?workspaceId=${selectedId}`);
    }
  };

  // Si el usuario no tiene equipos, mostramos un indicador neutro
  if (workspaces.length === 0) {
    return (
      <div className="text-sm font-medium text-slate-400">Sin espacios de trabajo</div>
    );
  }

  return (
    <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 shadow-sm hover:border-slate-300 transition-colors relative max-w-xs">
      {/* Avatar dinámico con las iniciales del Workspace activo */}
      <div className="w-7 h-7 bg-indigo-600 rounded-md flex items-center justify-center text-white font-bold text-xs shrink-0 select-none">
        {(activeWorkspace?.name || workspaces[0].workspace.name).substring(0, 2).toUpperCase()}
      </div>

      {/* Select invisible superpuesto para una interacción nativa y limpia */}
      <div className="flex flex-col pr-6">
        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider leading-none mb-0.5">Espacio Activo</span>
        <select
          value={activeWorkspaceId || workspaces[0].workspace.id}
          onChange={handleWorkspaceChange}
          className="bg-transparent text-sm font-semibold text-slate-700 outline-none cursor-pointer appearance-none pr-4 w-full"
        >
          {/* Si no hay ID en la URL, forzamos a que seleccione el primero de la lista */}
          {!activeWorkspaceId && (
            <option value="" disabled>Selecciona un equipo...</option>
          )}
          {workspaces.map((item) => (
            <option key={item.workspace.id} value={item.workspace.id}>
              {item.workspace.name}
            </option>
          ))}
        </select>
        {/* Flecha decorativa del select */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">
          ▼
        </div>
      </div>
    </div>
  );
}