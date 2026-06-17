import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LayoutDashboard, CheckSquare, Settings, User } from "lucide-react";
import Link from "next/link";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-slate-200">
          <span className="text-xl font-bold text-slate-900">TaskFlow Pro</span>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          <Link href="/" className="flex items-center gap-3 px-3 py-2 bg-slate-100 text-slate-900 rounded-md font-medium">
            <LayoutDashboard className="w-5 h-5" /> Dashboard
          </Link>
          <Link href="/tasks" className="flex items-center gap-3 px-3 py-2 text-slate-600 hover:bg-slate-50 rounded-md font-medium">
            <CheckSquare className="w-5 h-5" /> Mis Tareas
          </Link>
          <Link href="/profile" className="flex items-center gap-3 px-3 py-2 text-slate-600 hover:bg-slate-50 rounded-md font-medium">
            <User className="w-5 h-5" /> Perfil
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8">
          <h2 className="text-sm font-medium text-slate-500">Data & Engineering Team</h2>
          <div className="flex items-center gap-4">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CC</AvatarFallback>
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