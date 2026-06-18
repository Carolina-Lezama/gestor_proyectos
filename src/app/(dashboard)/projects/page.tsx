import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { FolderKanban, Plus, MoreVertical } from "lucide-react";
import Link from "next/link";

export default function ProjectsPage() {
  const projects = [
    {
      id: "1",
      name: "Predicción de Demanda - Olist",
      description: "Análisis de histórico de ventas utilizando el dataset de Olist.",
      progress: 65,
      status: "Activo",
      members: ["CC", "JD", "MR"]
    },
    {
      id: "2",
      name: "Migración de Base de Datos",
      description: "Actualización de esquemas locales a infraestructura en la nube.",
      progress: 15,
      status: "En Pausa",
      members: ["CC", "AL"]
    }
  ];

  return (
    <div className="max-w-6xl mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Proyectos</h1>
          <p className="text-slate-500 mt-2">Gestiona las iniciativas activas de tu espacio de trabajo.</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 gap-2">
          <Plus className="w-4 h-4" /> Nuevo Proyecto
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Card key={project.id} className="hover:shadow-md transition-shadow group">
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start mb-2">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                  <FolderKanban className="w-5 h-5" />
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </div>
              <CardTitle className="text-lg text-slate-900">{project.name}</CardTitle>
              <CardDescription className="line-clamp-2 mt-1">{project.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500 font-medium">Progreso</span>
                  <span className="text-slate-900 font-bold">{project.progress}%</span>
                </div>
                <Progress value={project.progress} className="h-2" />
                
                <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-4">
                  <div className="flex -space-x-2">
                    {project.members.map((initials, i) => (
                      <Avatar key={i} className="w-8 h-8 border-2 border-white">
                        <AvatarFallback className="text-[10px] bg-slate-100 text-slate-600 font-medium">{initials}</AvatarFallback>
                      </Avatar>
                    ))}
                  </div>
                  <Badge variant="secondary" className={project.status === 'Activo' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-600'}>
                    {project.status}
                  </Badge>
                </div>
              </div>
            </CardContent>
            {/* Enlace simulado al Dashboard que ya tenemos */}
            <div className="px-6 pb-6 pt-2">
               <Link href="/dashboard">
                  <Button variant="outline" className="w-full">Ver Tablero</Button>
               </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}