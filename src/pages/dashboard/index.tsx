// src/pages/dashboard/index.tsx
import { StatsOverview } from '../../widgets/Dashboard/StatsOverview';

export const DashboardPage = () => {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Xoş gəldin, Admin 👋
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Bazar ertəsi, 26 Yanvar 2026 - Biznesin cari vəziyyəti.
          </p>
        </div>
        
        {/* Sağ tərəf: Tarix filtri və ya Export düyməsi (Gələcək üçün placeholder) */}
        <div className="hidden sm:block">
          <button className="inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2">
            📊 Hesabatı yüklə
          </button>
        </div>
      </div>

      {/* Widget 1: KPI Kartları */}
      <StatsOverview />
      
      {/* Hələlik boş olan hissə - gələcəkdə bura cədvəl gələcək */}
      <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-12 text-center">
        <p className="text-sm text-gray-400">
          Pending Bookings və Today's Schedule buraya gələcək...
        </p>
      </div>
    </div>
  );
};
