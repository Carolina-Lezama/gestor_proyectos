"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { registerUser } from "@/actions/auth.actions";
import { useState } from "react";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const result = await registerUser(formData);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    } else if (result?.success) {
      // Redirección limpia al login tras el éxito
      router.push("/login");
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 px-4">
      <Card className="w-full max-w-[400px] shadow-lg border-slate-200">
        <form onSubmit={handleSubmit}>
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold tracking-tight text-slate-900">Crear cuenta</CardTitle>
            <CardDescription className="text-slate-500">Ingresa tus datos para empezar a colaborar</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            
            {error && (
              <div className="bg-red-50 text-red-600 border border-red-100 p-3 rounded-md text-sm text-center font-medium">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="name" className="text-slate-700">Nombre completo</Label>
              <Input 
                id="name" 
                name="name" 
                type="text"
                autoComplete="name"
                required 
                placeholder="Ej. Carolina Carrera" 
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-700">Correo electrónico</Label>
              <Input 
                id="email" 
                name="email" 
                type="email" 
                autoComplete="email"
                required 
                placeholder="correo@ejemplo.com" 
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-700">Contraseña</Label>
              <Input 
                id="password" 
                name="password" 
                type="password" 
                autoComplete="new-password"
                minLength={6}
                required 
                disabled={loading}
              />
            </div>
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={loading}>
              {loading ? "Creando cuenta..." : "Registrarse"}
            </Button>
          </CardContent>
          <CardFooter className="flex justify-center text-sm text-slate-500 pb-6">
            ¿Ya tienes una cuenta? 
            <Link href="/login" className="ml-1 font-medium text-blue-600 hover:text-blue-700 hover:underline">
              Inicia Sesión
            </Link>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}