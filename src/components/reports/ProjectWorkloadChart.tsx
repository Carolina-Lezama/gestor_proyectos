"use client";

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface ProjectWorkloadProps {
  data: {
    name: string;
    tareas: number;
  }[];
}

export function ProjectWorkloadChart({ data }: ProjectWorkloadProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-slate-400 text-sm font-medium">
        No hay proyectos con tareas asignadas.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        {/* Degradado para el área del gráfico */}
        <defs>
          <linearGradient id="colorTareas" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
          </linearGradient>
        </defs>
        
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
        
        <XAxis 
          dataKey="name" 
          axisLine={false} 
          tickLine={false} 
          tick={{ fontSize: 12, fill: '#64748b', fontWeight: 600 }} 
          dy={10} 
        />
        <YAxis 
          axisLine={false} 
          tickLine={false} 
          tick={{ fontSize: 12, fill: '#64748b' }} 
          allowDecimals={false}
        />
        
        <Tooltip 
          contentStyle={{ 
            borderRadius: '8px', 
            border: '1px solid #e2e8f0', 
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
            fontWeight: 500
          }}
          formatter={(value: any) => [`${value} tareas`, "Carga total"]}
        />
        
        <Area 
          type="monotone" 
          dataKey="tareas" 
          stroke="#4f46e5" 
          strokeWidth={3}
          fillOpacity={1} 
          fill="url(#colorTareas)" 
          animationDuration={1000}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}