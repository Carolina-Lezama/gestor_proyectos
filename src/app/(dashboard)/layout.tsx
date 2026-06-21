import { DashboardSidebar } from "@/components/shared/DashboardSidebar";
import { DashboardTopbar } from "@/components/shared/DashboardTopbar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-slate-50 overflow-hidden">
      
      {/* 1. Menú de navegación inyectado */}
      <DashboardSidebar />

      {/* 2. Contenedor principal */}
      <main className="flex-1 flex flex-col min-w-0">
        
        {/* 3. Barra superior inyectada */}
        <DashboardTopbar />
        
        {/* 4. Área de contenido dinámico (Kanban, Perfil, etc.) */}
        <div className="p-8 flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
        
      </main>
    </div>
  );
}