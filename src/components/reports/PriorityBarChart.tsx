"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

interface BarChartProps {
  data: {
    name: string;
    value: number;
    fill: string;
  }[];
}

export function PriorityBarChart({ data }: BarChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-slate-400 text-sm font-medium">
        No hay prioridades para graficar.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        {/* Líneas guía horizontales sutiles */}
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
        
        {/* Ejes limpios sin líneas gruesas */}
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
          allowDecimals={false} // Evitar tareas decimales (ej. 1.5 tareas)
        />
        
        <Tooltip 
          cursor={{ fill: '#f8fafc' }} // Color de fondo al pasar el ratón por la barra
          contentStyle={{ 
            borderRadius: '8px', 
            border: '1px solid #e2e8f0', 
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
            fontWeight: 500
          }}
          formatter={(value: any) => [`${value} tareas`, "Total"]}
        />
        
        {/* Renderizado de las barras con bordes redondeados superiores */}
        <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={60} animationDuration={800}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.fill} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}