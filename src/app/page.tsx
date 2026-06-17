import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, LayoutDashboard } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      {/* Navegación Superior */}
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

      {/* Sección Hero */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 pt-32 pb-20">
        <div className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-sm text-blue-600 mb-8 font-medium">
          <span className="flex h-2 w-2 rounded-full bg-blue-600 mr-2"></span>
          Versión 1.0 ya disponible
        </div>
        
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 mb-6 max-w-4xl leading-tight">
          Gestiona tus proyectos con la <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">precisión de un ingeniero</span>
        </h1>
        
        <p className="text-xl text-slate-500 mb-10 max-w-2xl leading-relaxed">
          La plataforma definitiva para equipos técnicos. Planifica flujos de trabajo, rastrea tareas en tiempo real y entrega resultados sin fricciones.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Link href="/dashboard">
            <Button size="lg" className="w-full sm:w-auto h-12 px-8 text-base bg-slate-900 hover:bg-slate-800 gap-2">
              Probar prototipo <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link href="/register">
            <Button size="lg" variant="outline" className="w-full sm:w-auto h-12 px-8 text-base">
              Crear cuenta gratis
            </Button>
          </Link>
        </div>

        {/* Tarjetas de Características */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-24 max-w-5xl w-full text-left">
          {[
            {
              title: "Tableros Kanban Interactivos",
              desc: "Arrastra y suelta tareas fluidamente. Visualiza el progreso de tu equipo de un vistazo."
            },
            {
              title: "Arquitectura Multi-Tenant",
              desc: "Espacios de trabajo aislados. Colabora con múltiples equipos sin cruzar información."
            },
            {
              title: "Base de Datos Relacional",
              desc: "Diseñado para escalar. Relaciones complejas entre proyectos, usuarios y etiquetas."
            }
          ].map((feature, i) => (
            <div key={i} className="flex flex-col bg-slate-50 p-6 rounded-2xl border border-slate-100 hover:shadow-md transition-shadow">
              <CheckCircle2 className="w-8 h-8 text-blue-600 mb-4" />
              <h3 className="font-bold text-slate-900 text-lg mb-2">{feature.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </main>

      {/* Footer Simple */}
      <footer className="border-t border-slate-100 py-8 text-center text-slate-500 text-sm">
        <p>© 2026 TaskFlow Pro. Proyecto de Arquitectura de Software.</p>
      </footer>
    </div>
  );
}