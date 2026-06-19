"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginUser } from "@/actions/auth.actions";
import { useState } from "react";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    
    try {
      const result = await loginUser(formData);
      // Solo manejamos el error visualmente. 
      // Si hay éxito, NextAuth redirige automáticamente y la página cambia.
      if (result?.error) {
        setError(result.error);
        setLoading(false);
      }
    } catch (e) {
      // Prevención de cuelgues si falla la red
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 px-4">
      <Card className="w-full max-w-[400px] shadow-lg border-slate-200">
        <form onSubmit={handleSubmit}>
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold tracking-tight text-slate-900">Bienvenido de nuevo</CardTitle>
            <CardDescription className="text-slate-500">Ingresa tus credenciales para acceder a tu espacio</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            
            {error && (
              <div className="bg-red-50 text-red-600 border border-red-100 p-3 rounded-md text-sm text-center font-medium">
                {error}
              </div>
            )}

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
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-slate-700">Contraseña</Label>
                {/* Opcional: Link para recuperar contraseña en el futuro */}
                <span className="text-xs text-slate-500 hover:underline cursor-pointer">¿La olvidaste?</span>
              </div>
              <Input 
                id="password" 
                name="password"
                type="password" 
                autoComplete="current-password"
                required
                disabled={loading}
              />
            </div>
            <Button type="submit" className="w-full bg-slate-900 hover:bg-slate-800" disabled={loading}>
              {loading ? "Verificando..." : "Iniciar Sesión"}
            </Button>
          </CardContent>
          <CardFooter className="flex justify-center text-sm text-slate-500 pb-6">
            ¿No tienes una cuenta? 
            <Link href="/register" className="ml-1 font-medium text-blue-600 hover:text-blue-700 hover:underline">
              Regístrate
            </Link>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}