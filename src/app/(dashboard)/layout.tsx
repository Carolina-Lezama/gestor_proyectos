"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LayoutDashboard, CheckSquare, User, FolderKanban, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Arreglo de rutas para automatizar el renderizado del menú
  const navItems = [
    { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/projects", icon: FolderKanban, label: "Proyectos" },
    { href: "/tasks", icon: CheckSquare, label: "Mis Tareas" },
    { href: "/workspaces", icon: Users, label: "Equipo" },
    { href: "/profile", icon: User, label: "Perfil" },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-slate-200">
          <span className="text-xl font-bold text-slate-900 tracking-tight">TaskFlow Pro</span>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            
            return (
              <Link 
                key={item.href} 
                href={item.href} 
                className={`flex items-center gap-3 px-3 py-2 rounded-md font-medium transition-colors ${
                  isActive 
                    ? "bg-slate-100 text-slate-900" 
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <Icon className="w-5 h-5" /> {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10">
          <h2 className="text-sm font-medium text-slate-500">Data & Engineering Team</h2>
          <div className="flex items-center gap-4">
            <Avatar className="cursor-pointer hover:ring-2 hover:ring-slate-200 transition-all">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback className="bg-blue-50 text-blue-700 font-medium">CC</AvatarFallback>
            </Avatar>
          </div>
        </header>
        
        {/* Page Content */}
        <div className="p-8 flex-1 overflow-auto">
          {children}
        </div>
      </main>
    </div>
  );
}