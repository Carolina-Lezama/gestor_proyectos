"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function ProfilePage() {
  return (
    <div className="max-w-3xl mx-auto py-8">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-8">Perfil de Usuario</h1>
      
      <Card className="shadow-sm border-slate-200">
        <CardHeader className="border-b border-slate-100 pb-6 mb-6">
          <CardTitle className="text-xl text-slate-800">Información Personal</CardTitle>
          <CardDescription className="text-slate-500">Actualiza tus datos y gestiona tu cuenta.</CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-8 px-8">
          {/* Sección de Avatar */}
          <div className="flex items-center gap-6">
            <Avatar className="h-24 w-24 border-2 border-slate-100 shadow-sm">
              <AvatarFallback className="text-3xl font-medium bg-blue-50 text-blue-700">
                CC
              </AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <h3 className="font-medium text-slate-900">Foto de perfil</h3>
              <p className="text-sm text-slate-500 mb-2">Formatos recomendados: JPG, PNG. Tamaño máximo 2MB.</p>
              <Button variant="outline" size="sm" className="font-medium">Cambiar Avatar</Button>
            </div>
          </div>

          {/* Sección de Formulario */}
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-3">
              <Label htmlFor="name" className="text-slate-700">Nombre Completo</Label>
              <Input id="name" defaultValue="Carolina Carrera" className="h-11" />
            </div>
            <div className="space-y-3">
              <Label htmlFor="email" className="text-slate-700">Correo Electrónico</Label>
              <Input 
                id="email" 
                defaultValue="carolina.dev@example.com" 
                disabled 
                className="h-11 bg-slate-50 text-slate-500 cursor-not-allowed" 
              />
            </div>
          </div>
        </CardContent>

        {/* Footer del Formulario */}
        <CardFooter className="bg-slate-50 border-t border-slate-100 px-8 py-4 flex justify-end rounded-b-xl mt-6">
          <Button className="bg-blue-600 hover:bg-blue-700 px-8">Guardar Cambios</Button>
        </CardFooter>
      </Card>
    </div>
  );
}