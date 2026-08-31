import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

/**
 * Göstərici kartı.
 *
 * Rəng burada məna daşıyır, bəzək deyil: sarı — diqqət tələb edən
 * (təsdiq gözləyən), yaşıl — gəlir, marka rəngi — günün işi. Ona görə
 * ton adları "blue/red" yox, mənaya görədir.
 */
export type StatTone = 'brand' | 'warning' | 'success' | 'info';

const TONES: Record<StatTone, { icon: string; halo: string }> = {
  brand: {
    icon: 'bg-brand-50 text-brand-700 dark:bg-brand-700/20 dark:text-brand-300',
    halo: 'bg-brand-100 dark:bg-brand-700/20',
  },
  warning: {
    icon: 'bg-warning-50 text-warning-700 dark:bg-warning-700/20 dark:text-warning-200',
    halo: 'bg-warning-200 dark:bg-warning-700/20',
  },
  success: {
    icon: 'bg-success-50 text-success-700 dark:bg-success-700/20 dark:text-success-200',
    halo: 'bg-success-200 dark:bg-success-700/20',
  },
  info: {
    icon: 'bg-info-50 text-info-700 dark:bg-info-700/20 dark:text-info-200',
    halo: 'bg-info-200 dark:bg-info-700/20',
  },
};

interface StatCardProps {
  title: string;
  value: string;
  /** Rəqəmi izah edən qeyd — müqayisə deyil. */
  note?: string;
  icon: ReactNode;
  tone: StatTone;
}

export const StatCard = ({ title, value, note, icon, tone }: StatCardProps) => {
  const theme = TONES[tone];

  return (
    <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-card p-4 shadow-xs transition-shadow hover:shadow-md sm:p-5 dark:border-slate-800">
      {/* Küncdəki yumşaq ləkə — kartı tamamilə düz görünməkdən çıxarır */}
      <div
        aria-hidden="true"
        className={cn(
          'pointer-events-none absolute -top-12 -right-12 size-24 rounded-full opacity-25 blur-2xl',
          theme.halo,
        )}
      />

      <div className="relative flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[13px] font-medium text-slate-500 sm:text-sm">{title}</p>
          <p className="tabular mt-1.5 text-2xl leading-none font-bold tracking-tight text-slate-900 sm:mt-2 sm:text-[28px] dark:text-white">
            {value}
          </p>
          {note && <p className="mt-2 text-xs text-slate-500">{note}</p>}
        </div>

        <span
          className={cn(
            'grid size-9 shrink-0 place-items-center rounded-[10px] sm:size-10',
            theme.icon,
          )}
        >
          {icon}
        </span>
      </div>
    </div>
  );
};
