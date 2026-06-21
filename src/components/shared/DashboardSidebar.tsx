"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  CheckSquare, 
  User, 
  FolderKanban, 
  Users, 
  Settings, 
  BarChart3, 
  Calendar 
} from "lucide-react";

export function DashboardSidebar() {
  const pathname = usePathname();

  // Se agregaron rutas preparadas para escalar el producto
  const navItems = [
    { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/projects", icon: FolderKanban, label: "Proyectos" },
    { href: "/tasks", icon: CheckSquare, label: "Mis Tareas" },
    { href: "/calendar", icon: Calendar, label: "Calendario" }, // <-- Futuro
    { href: "/reports", icon: BarChart3, label: "Reportes" },   // <-- Futuro
    { href: "/workspaces", icon: Users, label: "Equipo" },
    { href: "/profile", icon: User, label: "Perfil" },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col hidden md:flex">
      <div className="h-16 flex items-center px-6 border-b border-slate-200">
        <span className="text-xl font-bold text-slate-900 tracking-tight">TaskFlow Pro</span>
      </div>
      
      <div className="flex-1 flex flex-col justify-between overflow-y-auto">
        <nav className="px-4 py-6 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            
            return (
              <Link 
                key={item.href} 
                href={item.href} 
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors ${
                  isActive 
                    ? "bg-blue-50 text-blue-700" // Un azul más elegante para el activo
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <Icon className="w-5 h-5" /> {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Botón de configuración aislado al fondo */}
        <div className="p-4 border-t border-slate-100">
          <Link 
            href="/settings" 
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
          >
            <Settings className="w-5 h-5" /> Configuración
          </Link>
        </div>
      </div>
    </aside>
  );
}