"use client";

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface PieChartProps {
  data: {
    name: string;
    value: number;
    fill: string;
  }[];
}

export function TaskStatusPieChart({ data }: PieChartProps) {
  // Manejo de estado vacío de forma elegante
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-slate-400 text-sm font-medium">
        No hay tareas para graficar.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={70} // Radio interno (efecto Donut)
          outerRadius={100} // Radio externo
          paddingAngle={4} // Espacio entre las rebanadas
          dataKey="value"
          animationDuration={800} // Animación suave al cargar
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.fill} stroke="transparent" />
          ))}
        </Pie>
        
        {/* Tooltip personalizado e interactivo */}
        <Tooltip 
            formatter={(value: any) => [`${value} tareas`, "Total"]}
            contentStyle={{ 
            borderRadius: '8px', 
            border: '1px solid #e2e8f0', 
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
            fontWeight: 500
          }}
        />
        <Legend verticalAlign="bottom" height={36} iconType="circle" />
      </PieChart>
    </ResponsiveContainer>
  );
}