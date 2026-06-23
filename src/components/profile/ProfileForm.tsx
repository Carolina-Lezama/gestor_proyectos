"use client";

import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { updateUserProfile } from "@/actions/user.actions";

// Actualizamos la interfaz para recibir los nuevos campos de la BD
interface UserProps {
  user: {
    id: string;
    name: string | null;
    email: string;
    avatarUrl: string | null;
    phone?: string | null; // Nuevo campo opcional
    city?: string | null;  // Nuevo campo opcional
  };
}

export function ProfileForm({ user }: UserProps) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  
  // Estado para la previsualización de la imagen seleccionada
  const [imagePreview, setImagePreview] = useState<string | null>(user.avatarUrl);
  // Referencia para activar el input de archivo oculto
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getInitials = (name: string | null) => {
    if (!name) return "U";
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().substring(0, 2);
  };

  // Manejador para previsualizar la imagen antes de subirla
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Creamos una URL temporal en el navegador para mostrarla
      const objectUrl = URL.createObjectURL(file);
      setImagePreview(objectUrl);
    }
  };

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage(null);

    const formData = new FormData(event.currentTarget);
    
    // Aquí formData ya incluye el archivo de la imagen (bajo el nombre 'avatar') 
    // y los nuevos campos 'phone' y 'city' listos para enviarse al Server Action.
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

            {/* Sección de Avatar con selector de archivos */}
            <div className="flex items-center gap-6">
              <Avatar className="h-24 w-24 border-2 border-slate-100 shadow-sm">
                {imagePreview ? (
                  <AvatarImage src={imagePreview} alt="Profile preview" className="object-cover" />
                ) : null}
                <AvatarFallback className="text-3xl font-medium bg-blue-50 text-blue-700">
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                <h3 className="font-medium text-slate-900">Foto de perfil</h3>
                <p className="text-sm text-slate-500 mb-2">Formatos recomendados: JPG, PNG. Tamaño máximo 2MB.</p>
                
                {/* Input de archivo oculto */}
                <input 
                  type="file" 
                  name="avatar"
                  ref={fileInputRef} 
                  onChange={handleImageChange} 
                  accept="image/jpeg, image/png, image/webp" 
                  className="hidden" 
                />
                
                {/* Botón visual que dispara el input oculto */}
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  className="font-medium"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={loading}
                >
                  Cambiar Avatar
                </Button>
              </div>
            </div>

            {/* Grid de Formulario Expandido */}
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
              
              {/* Nuevos Campos */}
              <div className="space-y-3">
                <Label htmlFor="phone" className="text-slate-700">Teléfono</Label>
                <Input 
                  id="phone" 
                  name="phone" 
                  type="tel"
                  placeholder="+52 123 456 7890"
                  defaultValue={user.phone || ""} 
                  className="h-11" 
                  disabled={loading}
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="city" className="text-slate-700">Ciudad de Residencia</Label>
                <Input 
                  id="city" 
                  name="city" 
                  placeholder="Ej. Puebla"
                  defaultValue={user.city || ""} 
                  className="h-11" 
                  disabled={loading}
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