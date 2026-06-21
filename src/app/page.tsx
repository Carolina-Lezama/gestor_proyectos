import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { LandingNavbar } from "@/components/shared/LandingNavbar";
import { LandingFooter } from "@/components/shared/LandingFooter";
import { auth } from "@/auth"; // <-- Importamos auth aquí también

// Convertimos la página en async
export default async function LandingPage() {
  // Leemos la sesión
  const session = await auth();
  const isLoggedIn = !!session;

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      
      <LandingNavbar />

      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 pt-32 pb-10">
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
        
        {/* Renderizado condicional de los botones principales */}
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          {isLoggedIn ? (
            <Link href="/dashboard">
              <Button size="lg" className="w-full sm:w-auto h-12 px-8 text-base bg-blue-600 hover:bg-blue-700 gap-2">
                Ir a mi Dashboard <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          ) : (
            <>
              <Link href="/register">
                <Button size="lg" className="w-full sm:w-auto h-12 px-8 text-base bg-slate-900 hover:bg-slate-800 gap-2">
                  Comenzar gratis <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline" className="w-full sm:w-auto h-12 px-8 text-base">
                  Iniciar Sesión
                </Button>
              </Link>
            </>
          )}
        </div>

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

      <LandingFooter />
      
    </div>
  );
}