import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Predicción de Demanda - Olist</h1>
        <p className="text-slate-500 mt-2">Tablero de progreso del proyecto</p>
      </div>

      {/* Kanban Board Mockup */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Columna: Por Hacer */}
        <div className="bg-slate-100 p-4 rounded-xl h-min">
          <h3 className="font-semibold text-slate-700 mb-4 flex items-center justify-between">
            Por Hacer <span className="bg-slate-200 text-xs px-2 py-1 rounded-full">1</span>
          </h3>
          <Card className="shadow-sm cursor-grab">
            <CardHeader className="p-4 pb-2">
              <div className="text-xs font-semibold text-blue-600 mb-1">DATA SCIENCE</div>
              <CardTitle className="text-sm font-medium">Entrenar modelo base de regresión</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0 text-xs text-slate-500 flex justify-between items-center mt-4">
              <span>Prioridad: Media</span>
              <Avatar className="w-6 h-6"><AvatarFallback className="text-[10px]">CC</AvatarFallback></Avatar>
            </CardContent>
          </Card>
        </div>

        {/* Columna: En Progreso */}
        <div className="bg-slate-100 p-4 rounded-xl h-min">
          <h3 className="font-semibold text-slate-700 mb-4 flex items-center justify-between">
            En Progreso <span className="bg-slate-200 text-xs px-2 py-1 rounded-full">1</span>
          </h3>
          <Card className="shadow-sm border-l-4 border-l-amber-500 cursor-grab">
            <CardHeader className="p-4 pb-2">
              <div className="text-xs font-semibold text-amber-600 mb-1">DATABASE</div>
              <CardTitle className="text-sm font-medium">Diseñar esquema relacional</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0 text-xs text-slate-500 flex justify-between items-center mt-4">
              <span className="text-red-500 font-medium">Prioridad: Urgente</span>
              <Avatar className="w-6 h-6"><AvatarFallback className="text-[10px]">CC</AvatarFallback></Avatar>
            </CardContent>
          </Card>
        </div>

        {/* Columna: Completado */}
        <div className="bg-slate-100 p-4 rounded-xl h-min">
          <h3 className="font-semibold text-slate-700 mb-4 flex items-center justify-between">
            Completado <span className="bg-slate-200 text-xs px-2 py-1 rounded-full">1</span>
          </h3>
          <Card className="shadow-sm opacity-60">
            <CardHeader className="p-4 pb-2">
              <div className="text-xs font-semibold text-emerald-600 mb-1">DATA ENG</div>
              <CardTitle className="text-sm font-medium line-through">Extraer y limpiar dataset</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0 text-xs text-slate-500 mt-4">
              <span>Aprobado el 17 Jun</span>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}