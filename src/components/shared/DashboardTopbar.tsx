import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

export function DashboardTopbar() {
  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10">
      
      {/* Selector de Workspace (Por ahora estático, luego dinámico) */}
      <div className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 p-2 rounded-md transition-colors">
        <div className="w-8 h-8 bg-indigo-600 rounded-md flex items-center justify-center text-white font-bold text-xs">
          DE
        </div>
        <h2 className="text-sm font-semibold text-slate-700">Data & Engineering Team</h2>
      </div>

      <div className="flex items-center gap-4">
        {/* Notificaciones para el futuro */}
        <Button variant="ghost" size="icon" className="text-slate-500 hover:text-slate-900 relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </Button>

        <div className="h-6 w-px bg-slate-200 mx-2"></div>

        <Avatar className="cursor-pointer hover:ring-2 hover:ring-slate-200 transition-all w-9 h-9">
          <AvatarImage src="" />
          <AvatarFallback className="bg-blue-50 text-blue-700 font-medium text-sm">
            CC
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}