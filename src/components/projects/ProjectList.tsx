"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FolderKanban, Plus, MoreVertical, X, AlertCircle } from "lucide-react";
import Link from "next/link";
import { createProject } from "@/actions/project.actions";

// Definimos la estructura estricta de cómo el servidor nos entregará la información
export interface ProjectItem {
  id: string;
  name: string;
  description: string | null;
  progress: number;
  status: string;
  members: string[];
}

interface ProjectListProps {
  activeWorkspaceId: string;
  initialProjects: ProjectItem[];
}

export function ProjectList({ activeWorkspaceId, initialProjects }: ProjectListProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    // Inyectamos el ID del Workspace activo silenciosamente sin pedirselo al usuario
    formData.append("workspaceId", activeWorkspaceId);

    const result = await createProject(formData);

    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      // Éxito: Cerramos el panel y reseteamos el estado de carga
      setIsModalOpen(false);
      setLoading(false);
    }
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6">
      
      {/* Encabezado Principal */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Proyectos</h1>
          <p className="text-slate-500 mt-1">Gestiona las iniciativas activas de tu espacio de trabajo.</p>
        </div>
        <Button 
          onClick={() => setIsModalOpen(true)} 
          className="bg-blue-600 hover:bg-blue-700 font-medium gap-2 shrink-0 shadow-sm"
        >
          <Plus className="w-4 h-4" /> Nuevo Proyecto
        </Button>
      </div>

      {/* Cuadrícula de Proyectos o Estado Vacío */}
      {initialProjects.length === 0 ? (
         <Card className="border-dashed border-slate-300 bg-slate-50/50 py-12 text-center">
           <CardContent className="flex flex-col items-center justify-center space-y-4">
             <div className="p-3 bg-white rounded-full shadow-sm border border-slate-200">
               <FolderKanban className="w-8 h-8 text-slate-400" />
             </div>
             <div className="space-y-1">
               <p className="font-semibold text-slate-700 text-lg">No hay proyectos activos</p>
               <p className="text-slate-500 text-sm max-w-sm mx-auto">
                 Inicializa el primer proyecto de este espacio de trabajo para comenzar a asignar tareas y planificar sprints.
               </p>
             </div>
             <Button onClick={() => setIsModalOpen(true)} variant="outline" className="mt-2 font-medium">
               Crear mi primer Proyecto
             </Button>
           </CardContent>
         </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {initialProjects.map((project) => (
            <Card key={project.id} className="hover:shadow-md hover:border-slate-300 transition-all group flex flex-col justify-between border-slate-200">
              <div>
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                      <FolderKanban className="w-5 h-5" />
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </div>
                  <CardTitle className="text-lg text-slate-900 line-clamp-1">{project.name}</CardTitle>
                  <CardDescription className="line-clamp-2 min-h-[40px] mt-1 text-slate-500">
                    {project.description || "Sin descripción proporcionada."}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-500 font-medium">Progreso</span>
                      <span className="text-slate-900 font-bold">{project.progress}%</span>
                    </div>
                    <Progress value={project.progress} className="h-2 bg-slate-100" />
                    
                    <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-4">
                      <div className="flex -space-x-2">
                        {project.members.map((initials, i) => (
                          <Avatar key={i} className="w-8 h-8 border-2 border-white shadow-sm">
                            <AvatarFallback className="text-[10px] bg-slate-100 text-slate-600 font-medium">{initials}</AvatarFallback>
                          </Avatar>
                        ))}
                      </div>
                      <Badge variant="secondary" className={project.status === 'Activo' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-100 text-slate-600 border-slate-200'}>
                        {project.status}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </div>
              
              {/* Enlace dinámico que redirige al Dashboard con el Contexto Activo */}
              <div className="px-6 pb-6 pt-2 mt-auto border-t border-slate-50 bg-slate-50/30 rounded-b-xl">
                 <Link href={`/dashboard?workspaceId=${activeWorkspaceId}&projectId=${project.id}`}>
                    <Button variant="outline" className="w-full font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 border-blue-200 hover:border-blue-300 transition-colors">
                      Ver Tablero Kanban
                    </Button>
                 </Link>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Modal Flotante (React State + Tailwind) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <Card className="w-full max-w-lg shadow-2xl border-slate-200 bg-white animate-in zoom-in-95 duration-200">
            <form onSubmit={handleSubmit}>
              <CardHeader className="border-b border-slate-100 relative pb-4">
                <CardTitle className="text-xl font-bold text-slate-800">Crear un Nuevo Proyecto</CardTitle>
                <CardDescription className="text-slate-500">Añade una nueva iniciativa a este equipo.</CardDescription>
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-md hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </CardHeader>

              <CardContent className="space-y-5 pt-6 px-6">
                {error && (
                  <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-sm font-medium rounded-md text-center flex items-center justify-center gap-2">
                    <AlertCircle className="w-4 h-4" /> {error}
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-slate-700 font-medium">Nombre del Proyecto</Label>
                  <Input 
                    id="name" 
                    name="name" 
                    placeholder="Ej. Pipeline de Datos Olist, Migración AWS..." 
                    className="h-11"
                    disabled={loading}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-slate-700 font-medium">Descripción (Opcional)</Label>
                  <textarea 
                    id="description" 
                    name="description" 
                    placeholder="Describe los objetivos técnicos o entregables principales de este proyecto..." 
                    className="w-full min-h-[100px] p-3 rounded-md border border-slate-200 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={loading}
                  />
                </div>
              </CardContent>

              <div className="border-t border-slate-100 bg-slate-50 px-6 py-4 flex justify-end gap-3 rounded-b-xl">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsModalOpen(false)}
                  disabled={loading}
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  className="bg-blue-600 hover:bg-blue-700 font-medium px-6"
                  disabled={loading}
                >
                  {loading ? "Creando..." : "Crear Proyecto"}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}