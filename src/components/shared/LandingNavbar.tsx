import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LayoutDashboard } from "lucide-react";

export function LandingNavbar() {
  return (
    <header className="px-8 h-16 flex items-center justify-between border-b border-slate-100 bg-white/80 backdrop-blur-md fixed top-0 w-full z-50">
      <div className="flex items-center gap-2">
        <LayoutDashboard className="w-6 h-6 text-blue-600" />
        <span className="text-xl font-bold text-slate-900 tracking-tight">TaskFlow Pro</span>
      </div>
      <div className="flex gap-4">
        <Link href="/login">
          <Button variant="ghost" className="font-medium text-slate-600 hover:text-slate-900">
            Iniciar Sesión
          </Button>
        </Link>
        <Link href="/dashboard">
          <Button className="font-medium bg-blue-600 hover:bg-blue-700">
            Ir al Dashboard
          </Button>
        </Link>
      </div>
    </header>
  );
}