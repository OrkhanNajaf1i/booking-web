// src/pages/dashboard/index.tsx
import { StatsOverview } from '@/widgets/Dashboard/StatsOverview';
import { TodaySchedule } from '@/widgets/Dashboard/TodaySchedule';
import { PendingBookings } from '@/widgets/Dashboard/PendingBookings';
import { useBusinessQuery } from '@/entities/business';
import { formatDateWithWeekday } from '@/shared/lib/date';
import { PageHeader } from '@/shared/ui/primitives';

export const DashboardPage = () => {
  const { data: business } = useBusinessQuery();

  return (
    <div className="space-y-6">
      <PageHeader
        title={business?.name ?? 'Xoş gəldiniz'}
        description={`${formatDateWithWeekday(new Date())} — biznesin cari vəziyyəti.`}
      />

      <StatsOverview />

      <div className="grid gap-4 lg:grid-cols-2">
        <TodaySchedule />
        <PendingBookings />
      </div>
    </div>
  );
};
