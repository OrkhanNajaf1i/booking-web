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
      <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-8 text-center">
        <p className="text-sm text-gray-500">
          Statistika yüklənmədi. Səhifəni yeniləyin.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Bu günün randevuları"
        value={String(data.today_total)}
        trend={
          data.today_confirmed > 0
            ? `${data.today_confirmed} təsdiqlənib`
            : undefined
        }
        trendUp
        color="blue"
        icon={<CalendarIcon className="h-6 w-6" />}
      />

      <StatCard
        title="Təsdiq gözləyən"
        value={String(data.pending_total)}
        trend={
          data.today_pending > 0 ? `${data.today_pending} bu gün` : undefined
        }
        trendUp={data.today_pending > 0}
        color="yellow"
        icon={<ClockIcon className="h-6 w-6" />}
      />

      <StatCard
        title="Bu ayın gəliri"
        value={formatMoney(data.month_revenue)}
        trend={
          data.month_completed > 0
            ? `${data.month_completed} tamamlanıb`
            : undefined
        }
        trendUp
        color="green"
        icon={<WalletIcon className="h-6 w-6" />}
      />

      <StatCard
        title="Müştərilər"
        value={String(data.customers_total)}
        trend={data.customers_new > 0 ? `${data.customers_new} yeni` : undefined}
        trendUp
        color="red"
        icon={<UsersIcon className="h-6 w-6" />}
      />
    </div>
  );
};
