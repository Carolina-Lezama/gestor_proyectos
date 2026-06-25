import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, AlertCircle } from "lucide-react";

interface TaskCardProps {
  task: {
    id: string;
    title: string;
    description: string | null;
    priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
    dueDate: Date | null;
  };
}

export function TaskCard({ task }: TaskCardProps) {
  // Paleta de colores para las prioridades de tus Enums
  const priorityColors = {
    LOW: "bg-slate-100 text-slate-700 border-slate-200",
    MEDIUM: "bg-blue-100 text-blue-700 border-blue-200",
    HIGH: "bg-amber-100 text-amber-700 border-amber-200",
    URGENT: "bg-red-100 text-red-700 border-red-200 animate-pulse",
  };

  return (
    <Card className="bg-white shadow-sm border-slate-200 hover:shadow-md hover:border-slate-300 transition-all cursor-grab active:cursor-grabbing group">
      <CardHeader className="p-4 pb-2 space-y-0">
        <div className="flex justify-between items-start gap-2 mb-2">
          <Badge variant="outline" className={`${priorityColors[task.priority]} font-semibold text-[10px] tracking-wider uppercase`}>
            {task.priority}
          </Badge>
        </div>
        <CardTitle className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
          {task.title}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-4 pt-0 space-y-3">
        {task.description && (
          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
            {task.description}
          </p>
        )}
        
        {task.dueDate && (
          <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-400 pt-1 border-t border-slate-50">
            <Calendar className="w-3.5 h-3.5" />
            <span>{new Date(task.dueDate).toLocaleDateString()}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}