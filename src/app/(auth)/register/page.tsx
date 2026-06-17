import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function RegisterPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50">
      <Card className="w-[400px] shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold tracking-tight">Crear una cuenta</CardTitle>
          <CardDescription>Ingresa tus datos para continuar</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          
          <div className="space-y-2">
            <Label htmlFor="email">Correo electrónico</Label>
            <Input id="email" type="email" placeholder="carolina.dev@example.com" />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="name">Nombre completo</Label>
            <Input id="name" type="text" placeholder="Carolina" />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="tel">Número telefónico</Label>
            <Input id="tel" type="tel" placeholder="000 000 0000" />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input id="password" type="password" />
          </div>
          
          <Button className="w-full">Crear cuenta</Button>
        </CardContent>
        <CardFooter className="flex justify-center text-sm text-slate-500">
          ¿Ya tienes cuenta? <Link href="/login" className="ml-1 font-medium text-slate-900 hover:underline">Inicia sesión</Link>
        </CardFooter>
      </Card>
    </div>
  );
}