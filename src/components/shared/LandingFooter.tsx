import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LayoutDashboard, Send } from "lucide-react";

export function LandingFooter() {
  return (
    <footer className="bg-slate-50 border-t border-slate-200 pt-16 pb-8 px-8 mt-24">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        
        {/* Columna 1: Marca y Ayuda (Cuadro de Quejas/Soporte) */}
        <div className="md:col-span-1 space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <LayoutDashboard className="w-6 h-6 text-blue-600" />
            <span className="text-xl font-bold text-slate-900 tracking-tight">TaskFlow Pro</span>
          </div>
          <p className="text-sm text-slate-500 mb-6">
            La plataforma definitiva para gestionar flujos de trabajo técnicos y equipos de datos.
          </p>
          
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mt-6">
            <h4 className="font-semibold text-slate-900 text-sm mb-2">¿Necesitas ayuda o soporte?</h4>
            <p className="text-xs text-slate-500 mb-3">Déjanos tu correo y un especialista se pondrá en contacto.</p>
            <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
              <Input placeholder="tu@correo.com" type="email" className="h-9 text-xs" />
              <Button size="icon" className="h-9 w-9 shrink-0 bg-blue-600 hover:bg-blue-700">
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </div>
        </div>

        {/* Columna 2: Producto */}
        <div>
          <h4 className="font-semibold text-slate-900 mb-4">Producto</h4>
          <ul className="space-y-3 text-sm text-slate-500">
            <li><Link href="#" className="hover:text-blue-600 transition-colors">Características</Link></li>
            <li><Link href="#" className="hover:text-blue-600 transition-colors">Integraciones</Link></li>
            <li><Link href="#" className="hover:text-blue-600 transition-colors">Precios</Link></li>
            <li><Link href="#" className="hover:text-blue-600 transition-colors">Changelog</Link></li>
          </ul>
        </div>

        {/* Columna 3: Recursos */}
        <div>
          <h4 className="font-semibold text-slate-900 mb-4">Recursos</h4>
          <ul className="space-y-3 text-sm text-slate-500">
            <li><Link href="#" className="hover:text-blue-600 transition-colors">Documentación API</Link></li>
            <li><Link href="#" className="hover:text-blue-600 transition-colors">Guías de inicio</Link></li>
            <li><Link href="#" className="hover:text-blue-600 transition-colors">Blog técnico</Link></li>
            <li><Link href="#" className="hover:text-blue-600 transition-colors">Comunidad</Link></li>
          </ul>
        </div>

        {/* Columna 4: Legal */}
        <div>
          <h4 className="font-semibold text-slate-900 mb-4">Legal</h4>
          <ul className="space-y-3 text-sm text-slate-500">
            <li><Link href="#" className="hover:text-blue-600 transition-colors">Términos de servicio</Link></li>
            <li><Link href="#" className="hover:text-blue-600 transition-colors">Política de privacidad</Link></li>
            <li><Link href="#" className="hover:text-blue-600 transition-colors">Seguridad de datos</Link></li>
          </ul>
        </div>
      </div>

      <div className="max-w-6xl mx-auto border-t border-slate-200 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500">
        <p>© 2026 TaskFlow Pro. Desarrollado por Carolina Carrera.</p>
        <div className="flex gap-6">
          <Link href="#" className="hover:text-slate-900 transition-colors">Twitter (X)</Link>
          <Link href="#" className="hover:text-slate-900 transition-colors">GitHub</Link>
          <Link href="#" className="hover:text-slate-900 transition-colors">LinkedIn</Link>
        </div>
      </div>
    </footer>
  );
}