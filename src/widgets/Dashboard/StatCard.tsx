import type { ReactNode } from 'react';
import { cn } from '../../shared/lib/utils';

interface StatCardProps{
    title: string;
    value: string;
    trend?: string;
    trendUp?: boolean;
    icon: ReactNode;
    color: 'blue' | 'green' | 'yellow' | 'red';
}

export const StatCard = ({title, value, trend, trendUp, icon, color}:StatCardProps) => {
    const colors = {
        blue: {
            bg: 'bg-blue-50',
            text: 'text-blue-600',
            border: 'border-blue-100',
            iconBg: 'bg-blue-100',
        },
        green: {
            bg: 'bg-green-50',
            text: 'text-green-600',
            border: 'border-green-100',
            iconBg: 'bg-green-100',
        },
        yellow: {
            bg: 'bg-yellow-50',
            text: 'text-yellow-600',
            border: 'border-yellow-100',
            iconBg: 'bg-yellow-100',
        },
        red: {
            bg: 'bg-red-50',
            text: 'text-red-600',
            border: 'border-red-100',
            iconBg: 'bg-red-100',
        },
    };
    const theme = colors[color]
    return  <div className={cn(
      "relative overflow-hidden rounded-2xl bg-white p-6 transition-all duration-300",
      "border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]", // Yumşaq kölgə
      "hover:-translate-y-1 hover:shadow-[0_8px_20px_-6px_rgba(0,0,0,0.1)]" // Hover effekti
    )}>
      {/* Arxa planda dekorativ dairə (müasir görünüş üçün) */}
      <div className={cn("absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-20", theme.bg)} />

      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <h3 className="mt-2 text-3xl font-bold text-gray-900 tracking-tight">
            {value}
          </h3>
          
          {/* Alt qeyd — rəqəmi izah edir (müqayisə deyil) */}
          {trend && (
            <div className="mt-2 flex items-center text-sm">
              <span className={cn(
                "font-medium",
                trendUp ? "text-green-600" : "text-gray-500"
              )}>
                {trend}
              </span>
            </div>
          )}
        </div>

        {/* İkon qutusu */}
        <div className={cn(
          "flex h-12 w-12 items-center justify-center rounded-xl",
          theme.iconBg,
          theme.text
        )}>
          {icon}
        </div>
      </div>
    </div>
}   