import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WorkspaceSelector } from "./WorkspaceSelector";

export async function DashboardTopbar() {
  // 1. Obtenemos la sesión del usuario en el servidor
  const session = await auth();
  
  // 2. Buscamos los datos completos del usuario (para el avatar) y sus workspaces
  const dbUser = session?.user?.email 
    ? await prisma.user.findUnique({
        where: { email: session.user.email },
        select: {
          name: true,
          avatarUrl: true,
          workspaces: {
            select: {
              workspace: {
                select: { id: true, name: true }
              }
            }
          }
        }
      })
    : null;

  // Generador de iniciales para el avatar
  const getInitials = (name: string | null) => {
    if (!name) return "U";
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().substring(0, 2);
  };

  const workspaces = dbUser?.workspaces || [];

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10">
      
      {/* Inyectamos el componente de cliente pasándole los datos de Prisma */}
      <WorkspaceSelector workspaces={workspaces} />

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="text-slate-500 hover:text-slate-900 relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </Button>

        <div className="h-6 w-px bg-slate-200 mx-2"></div>

        <Avatar className="cursor-pointer hover:ring-2 hover:ring-slate-200 transition-all w-9 h-9">
          <AvatarImage src={dbUser?.avatarUrl || ""} className="object-cover" />
          <AvatarFallback className="bg-blue-50 text-blue-700 font-medium text-sm">
            {getInitials(dbUser?.name || session?.user?.name || null)}
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}