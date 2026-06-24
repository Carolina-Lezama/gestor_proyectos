"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Users, Plus, FolderKanban, Calendar, X } from "lucide-react";
import { createWorkspace } from "@/actions/workspace.actions";
import Link from "next/link";

// Estructura estricta de los datos que vendrán del servidor
interface WorkspaceItem {
  role: "OWNER" | "ADMIN" | "MEMBER";
  workspace: {
    id: string;
    name: string;
    description: string | null;
    createdAt: Date;
    _count?: {
      projects: number;
    };
  };
}

interface WorkspaceListProps {
  initialWorkspaces: WorkspaceItem[];
}

export function WorkspaceList({ initialWorkspaces }: WorkspaceListProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mapeo de colores estéticos para los badges de roles
  const roleColors = {
    OWNER: "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-50",
    ADMIN: "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-50",
    MEMBER: "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-50",
  };

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const result = await createWorkspace(formData);

    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      // Si todo sale bien, cerramos el panel y limpiamos estados
      setIsModalOpen(false);
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Encabezado con Botón de Acción */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Espacios de Trabajo</h1>
          <p className="text-slate-500 mt-1">Gestiona tus equipos de ingeniería, laboratorios de datos y entornos aislados.</p>
        </div>
        <Button 
          onClick={() => setIsModalOpen(true)} 
          className="bg-blue-600 hover:bg-blue-700 font-medium gap-2 shrink-0 shadow-sm"
        >
          <Plus className="w-4 h-4" /> Nuevo Equipo
        </Button>
      </div>

      {/* Grid de Equipos Existentes */}
      {initialWorkspaces.length === 0 ? (
        <Card className="border-dashed border-slate-300 bg-slate-50/50 py-12 text-center">
          <CardContent className="flex flex-col items-center justify-center space-y-4">
            <div className="p-3 bg-white rounded-full shadow-sm border border-slate-200">
              <Users className="w-8 h-8 text-slate-400" />
            </div>
            <div className="space-y-1">
              <p className="font-semibold text-slate-700 text-lg">No perteneces a ningún equipo aún</p>
              <p className="text-slate-500 text-sm max-w-sm mx-auto">
                Crea tu primer espacio de trabajo para empezar a desplegar proyectos y flujos Kanban.
              </p>
            </div>
            <Button onClick={() => setIsModalOpen(true)} variant="outline" className="mt-2 font-medium">
              Inicializar mi primer Workspace
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {initialWorkspaces.map((item) => (
            <Card key={item.workspace.id} className="hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between border-slate-200">
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start gap-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold shadow-sm shrink-0">
                    {item.workspace.name.substring(0, 2).toUpperCase()}
                  </div>
                  <Badge variant="outline" className={`${roleColors[item.role]} font-medium uppercase tracking-wider text-[10px]`}>
                    {item.role === 'OWNER' ? 'Propietario' : item.role === 'ADMIN' ? 'Administrador' : 'Miembro'}
                  </Badge>
                </div>
                <CardTitle className="text-lg font-bold text-slate-800 mt-4 line-clamp-1">
                  {item.workspace.name}
                </CardTitle>
                <CardDescription className="text-slate-500 text-sm line-clamp-2 min-h-[40px] mt-1">
                  {item.workspace.description || "Sin descripción proporcionada."}
                </CardDescription>
              </CardHeader>

              <CardContent className="border-t border-slate-100 py-3 bg-slate-50/50 flex items-center justify-between text-xs text-slate-500 px-6">
                <div className="flex items-center gap-1.5 font-medium text-slate-600">
                  <FolderKanban className="w-4 h-4 text-slate-400" />
                  <span>{item.workspace._count?.projects || 0} Proyectos</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span>{new Date(item.workspace.createdAt).toLocaleDateString()}</span>
                </div>
              </CardContent>

            <CardFooter className="p-4 border-t border-slate-100 bg-white flex justify-end rounded-b-xl">
            <Link href={`/dashboard?workspaceId=${item.workspace.id}`} className="w-full">
                <Button variant="outline" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 font-semibold w-full">
                Entrar al Espacio
                </Button>
            </Link>
            </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Modal Flotante (Puro Tailwind + React State) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <Card className="w-full max-w-lg shadow-2xl border-slate-200 bg-white animate-in zoom-in-95 duration-200">
            <form onSubmit={handleSubmit}>
              <CardHeader className="border-b border-slate-100 relative pb-4">
                <CardTitle className="text-xl font-bold text-slate-800">Crear un Nuevo Workspace</CardTitle>
                <CardDescription className="text-slate-500">Configura un espacio aislado para tu equipo.</CardDescription>
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
                  <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-sm font-medium rounded-md text-center">
                    {error}
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-slate-700 font-medium">Nombre del Equipo / Organización</Label>
                  <Input 
                    id="name" 
                    name="name" 
                    placeholder="Ej. Data & Analytics Lab, Core Backend" 
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
                    placeholder="Describe los objetivos, proyectos o el alcance de este equipo de trabajo..." 
                    className="w-full min-h-[100px] p-3 rounded-md border border-slate-200 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={loading}
                  />
                </div>
              </CardContent>

              <CardFooter className="border-t border-slate-100 bg-slate-50 px-6 py-4 flex justify-end gap-3 rounded-b-xl">
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
                  {loading ? "Inicializando..." : "Crear Espacio"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}