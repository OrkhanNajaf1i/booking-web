import { useQuery } from '@tanstack/react-query';
import { CalendarIcon, WalletIcon, ClockIcon, UsersIcon } from 'lucide-react';

import { dashboardApi } from '@/entities/dashboard/api/dashboardApi';
import { StatCard } from './StatCard';
import { StatsOverviewSkeleton } from './StatsOverviewSkeleton';

/** Məbləği manatla göstərir. */
function formatMoney(value: number): string {
  return `₼ ${value.toLocaleString('az-AZ', { maximumFractionDigits: 0 })}`;
}

export const StatsOverview = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: dashboardApi.getStats,
    // Realtime hadisə gələndə RealtimeProvider bu keşi invalidasiya edir.
    staleTime: 30_000,
  });

  if (isLoading) return <StatsOverviewSkeleton />;

  if (isError || !data) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-white/50 p-8 text-center dark:border-slate-700 dark:bg-transparent">
        <p className="text-sm text-slate-500">
          Statistika yüklənmədi. Səhifəni yeniləyin.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        title="Bu günün randevuları"
        value={String(data.today_total)}
        note={
          data.today_confirmed > 0
            ? `${data.today_confirmed} təsdiqlənib`
            : undefined
        }
        tone="brand"
        icon={<CalendarIcon className="size-5" />}
      />

      <StatCard
        title="Təsdiq gözləyən"
        value={String(data.pending_total)}
        note={data.today_pending > 0 ? `${data.today_pending} bu gün` : undefined}
        tone="warning"
        icon={<ClockIcon className="size-5" />}
      />

      <StatCard
        title="Bu ayın gəliri"
        value={formatMoney(data.month_revenue)}
        note={
          data.month_completed > 0
            ? `${data.month_completed} tamamlanıb`
            : undefined
        }
        tone="success"
        icon={<WalletIcon className="size-5" />}
      />

      <StatCard
        title="Müştərilər"
        value={String(data.customers_total)}
        note={data.customers_new > 0 ? `${data.customers_new} yeni` : undefined}
        tone="info"
        icon={<UsersIcon className="size-5" />}
      />
    </div>
  );
};
