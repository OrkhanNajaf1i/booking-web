import { apiClient } from '@/shared/api/client';
import type { ApiEnvelope } from '@/entities/availability/model/types';

export interface DashboardStats {
  /** Bu gün (ləğv edilənlər sayılmır) */
  today_total: number;
  today_pending: number;
  today_confirmed: number;

  /** Bütün vaxt üzrə cavab gözləyənlər */
  pending_total: number;

  /** Cari ay */
  month_completed: number;
  month_cancelled: number;
  /** Yalnız tamamlanmış randevulardan — təsdiqlənmiş hələ gəlir deyil */
  month_revenue: number;

  customers_total: number;
  customers_new: number;
}

export const dashboardApi = {
  getStats: async (): Promise<DashboardStats> => {
    // Timezone göndəririk ki, "bu gün" serverin yox, istifadəçinin günü olsun.
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const { data } = await apiClient.get<ApiEnvelope<DashboardStats>>(
      '/dashboard/stats',
      { params: timezone ? { tz: timezone } : undefined }
    );
    return data.data;
  },
};
