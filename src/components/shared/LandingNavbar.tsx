import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, LogOut } from "lucide-react";
import { auth, signOut } from "@/auth"; // <-- Importamos signOut

export async function LandingNavbar() {
  const session = await auth();
  const isLoggedIn = !!session;

  return (
    <header className="px-8 h-16 flex items-center justify-between border-b border-slate-100 bg-white/80 backdrop-blur-md fixed top-0 w-full z-50">
      <div className="flex items-center gap-2">
        <LayoutDashboard className="w-6 h-6 text-blue-600" />
        <span className="text-xl font-bold text-slate-900 tracking-tight">TaskFlow Pro</span>
      </div>
      <div className="flex items-center gap-4">
        {isLoggedIn ? (
          <>
            <Link href="/dashboard">
              <Button className="font-medium bg-blue-600 hover:bg-blue-700">
                Ir al Dashboard
              </Button>
            </Link>
            {/* Formulario con Server Action en línea para cerrar sesión */}
            <form action={async () => {
              "use server";
              await signOut({ redirectTo: "/" });
            }}>
              <Button variant="ghost" className="font-medium text-slate-600 hover:text-red-600 hover:bg-red-50 gap-2">
                <LogOut className="w-4 h-4" /> Cerrar Sesión
              </Button>
            </form>
          </>
        ) : (
          <>
            <Link href="/login">
              <Button variant="ghost" className="font-medium text-slate-600 hover:text-slate-900">
                Iniciar Sesión
              </Button>
            </Link>
            <Link href="/register">
              <Button className="font-medium bg-blue-600 hover:bg-blue-700">
                Crear Cuenta
              </Button>
            </Link>
          </>
        )}
      </div>
    </header>
  );
}