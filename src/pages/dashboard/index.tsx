// src/pages/dashboard/index.tsx
import { StatsOverview } from '@/widgets/Dashboard/StatsOverview';
import { TodaySchedule } from '@/widgets/Dashboard/TodaySchedule';
import { PendingBookings } from '@/widgets/Dashboard/PendingBookings';
import { useBusinessQuery } from '@/entities/business';
import { formatDateWithWeekday } from '@/shared/lib/date';

export const DashboardPage = () => {
  const { data: business } = useBusinessQuery();

  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            {business?.name ? `${business.name} 👋` : 'Xoş gəldiniz 👋'}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {formatDateWithWeekday(new Date())} — biznesin cari vəziyyəti.
          </p>
        </div>
      </header>

      <StatsOverview />

      <div className="grid gap-6 lg:grid-cols-2">
        <TodaySchedule />
        <PendingBookings />
      </div>
    </div>
  );
};
