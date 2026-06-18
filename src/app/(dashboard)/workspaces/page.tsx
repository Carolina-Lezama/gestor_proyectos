import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Building2, Mail, ShieldAlert, UserPlus } from "lucide-react";

export default function WorkspaceSettingsPage() {
  const members = [
    { name: "Carolina Carrera", email: "carolina.dev@example.com", role: "Owner", initials: "CC" },
    { name: "Juan Developer", email: "juan@example.com", role: "Admin", initials: "JD" },
    { name: "María Data", email: "maria@example.com", role: "Member", initials: "MD" },
  ];

  return (
    <div className="max-w-4xl mx-auto py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Data & Engineering Team</h1>
        <p className="text-slate-500 mt-2">Configuración general y gestión de miembros del equipo.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Columna Izquierda: Configuración del Workspace */}
        <div className="md:col-span-1 space-y-6">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Building2 className="w-5 h-5 text-slate-400" /> Detalles
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Nombre del Espacio</Label>
                <Input defaultValue="Data & Engineering Team" />
              </div>
              <Button className="w-full">Actualizar</Button>
            </CardContent>
          </Card>

          <Card className="border-red-100 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg text-red-600 flex items-center gap-2">
                <ShieldAlert className="w-5 h-5" /> Zona Peligrosa
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-slate-500 mb-4">Eliminar este espacio borrará todos los proyectos y tareas permanentemente.</p>
              <Button variant="destructive" className="w-full">Eliminar Espacio</Button>
            </CardContent>
          </Card>
        </div>

        {/* Columna Derecha: Gestión de Miembros */}
        <div className="md:col-span-2 space-y-6">
          <Card className="shadow-sm">
            <CardHeader className="border-b border-slate-100 pb-6 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">Miembros del Equipo</CardTitle>
                  <CardDescription>Invita a nuevos colaboradores o gestiona sus permisos.</CardDescription>
                </div>
                <Badge variant="secondary" className="bg-blue-50 text-blue-700">3 Usuarios</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              
              {/* Formulario de Invitación */}
              <div className="flex gap-3 items-end p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div className="flex-1 space-y-2">
                  <Label className="text-slate-700">Invitar por correo electrónico</Label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <Input placeholder="correo@ejemplo.com" className="pl-9 bg-white" />
                  </div>
                </div>
                <Button className="bg-slate-900 hover:bg-slate-800 gap-2">
                  <UserPlus className="w-4 h-4" /> Invitar
                </Button>
              </div>

              {/* Lista de Usuarios */}
              <div className="divide-y divide-slate-100">
                {members.map((member, idx) => (
                  <div key={idx} className="py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback className="bg-slate-100 text-slate-700 font-medium">{member.initials}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{member.name}</p>
                        <p className="text-xs text-slate-500">{member.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className={
                        member.role === 'Owner' ? 'border-purple-200 text-purple-700 bg-purple-50' : 
                        member.role === 'Admin' ? 'border-blue-200 text-blue-700 bg-blue-50' : 'text-slate-500'
                      }>
                        {member.role}
                      </Badge>
                      {member.role !== 'Owner' && (
                        <Button variant="ghost" size="sm" className="text-slate-400 hover:text-red-600">Remover</Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}