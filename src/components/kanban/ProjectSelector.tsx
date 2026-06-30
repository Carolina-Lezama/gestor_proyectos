"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FolderKanban } from "lucide-react";

interface ProjectSelectorProps {
  workspaceId: string;
  activeProjectId: string;
  projects: {
    id: string;
    name: string;
  }[];
}

export function ProjectSelector({ workspaceId, activeProjectId, projects }: ProjectSelectorProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleProjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    if (selectedId) {
      // Modificamos la URL preservando el espacio de trabajo actual e inyectando el nuevo proyecto
      router.push(`/dashboard?workspaceId=${workspaceId}&projectId=${selectedId}`);
    }
  };

  return (
    <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-1.5 shadow-sm hover:border-slate-300 transition-all relative min-w-[200px] max-w-xs">
      <FolderKanban className="w-4 h-4 text-blue-500 shrink-0" />
      
      <div className="flex flex-col pr-4 w-full">
        <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider leading-none mb-0.5">
          Proyecto Seleccionado
        </span>
        <select
          value={activeProjectId}
          onChange={handleProjectChange}
          className="bg-transparent text-sm font-bold text-slate-800 outline-none cursor-pointer appearance-none pr-4 w-full truncate"
        >
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))}
        </select>
        {/* Flecha decorativa */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-[10px]">
          ▼
        </div>
      </div>
    </div>
  );
}