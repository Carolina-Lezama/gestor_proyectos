"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { updateUserProfile } from "@/actions/user.actions";

// Definimos la interfaz estricta basada en tu modelo de Prisma
interface UserProps {
  user: {
    id: string;
    name: string | null;
    email: string;
    avatarUrl: string | null;
  };
}

export function ProfileForm({ user }: UserProps) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Generador de iniciales dinámicas (Ej. "Carolina Carrera" -> "CC")
  const getInitials = (name: string | null) => {
    if (!name) return "U";
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().substring(0, 2);
  };

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage(null);

    const formData = new FormData(event.currentTarget);
    const result = await updateUserProfile(formData);

    if (result.error) {
      setMessage({ type: 'error', text: result.error });
    } else if (result.success) {
      setMessage({ type: 'success', text: result.success });
    }
    
    setLoading(false);
  }

  return (
    <div className="max-w-3xl mx-auto py-8">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-8">Perfil de Usuario</h1>
      
      <Card className="shadow-sm border-slate-200">
        <form onSubmit={handleSubmit}>
          <CardHeader className="border-b border-slate-100 pb-6 mb-6">
            <CardTitle className="text-xl text-slate-800">Información Personal</CardTitle>
            <CardDescription className="text-slate-500">Actualiza tus datos y gestiona tu cuenta.</CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-8 px-8">
            
            {message && (
              <div className={`p-3 rounded-md text-sm font-medium text-center ${
                message.type === 'error' ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
              }`}>
                {message.text}
              </div>
            )}

            <div className="flex items-center gap-6">
              <Avatar className="h-24 w-24 border-2 border-slate-100 shadow-sm">
                <AvatarFallback className="text-3xl font-medium bg-blue-50 text-blue-700">
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                <h3 className="font-medium text-slate-900">Foto de perfil</h3>
                <p className="text-sm text-slate-500 mb-2">Formatos recomendados: JPG, PNG. Tamaño máximo 2MB.</p>
                <Button type="button" variant="outline" size="sm" className="font-medium">Cambiar Avatar</Button>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-3">
                <Label htmlFor="name" className="text-slate-700">Nombre Completo</Label>
                <Input 
                  id="name" 
                  name="name" 
                  defaultValue={user.name || ""} 
                  className="h-11" 
                  disabled={loading}
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="email" className="text-slate-700">Correo Electrónico</Label>
                <Input 
                  id="email" 
                  defaultValue={user.email} 
                  disabled 
                  className="h-11 bg-slate-50 text-slate-500 cursor-not-allowed" 
                />
              </div>
            </div>
          </CardContent>

          <CardFooter className="bg-slate-50 border-t border-slate-100 px-8 py-4 flex justify-end rounded-b-xl mt-6">
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 px-8" disabled={loading}>
              {loading ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}