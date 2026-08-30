import { apiClient } from '@/shared/api/client';
import type { ApiEnvelope } from '@/entities/availability/model/types';
import type { NotificationListResult } from '../model/types';

export const notificationApi = {
  list: async (params?: { unread?: boolean; limit?: number; offset?: number }) => {
    const { data } = await apiClient.get<ApiEnvelope<NotificationListResult>>(
      '/notifications',
      { params }
    );
    return data.data ?? { items: [], unread_count: 0 };
  },

  countUnread: async (): Promise<number> => {
    const { data } = await apiClient.get<ApiEnvelope<{ unread_count: number }>>(
      '/notifications/unread-count'
    );
    return data.data?.unread_count ?? 0;
  },

  markRead: async (id: string): Promise<void> => {
    await apiClient.post(`/notifications/${id}/read`);
  },

  markAllRead: async (): Promise<void> => {
    await apiClient.post('/notifications/read-all');
  },

  /** Push üçün brauzer/cihaz token-i (FCM web push istifadə olunanda). */
  registerDevice: async (token: string, platform: 'web' | 'ios' | 'android' = 'web') => {
    await apiClient.post('/notifications/devices', { token, platform });
  },

  unregisterDevice: async (token: string): Promise<void> => {
    await apiClient.delete('/notifications/devices', { params: { token } });
  },
};
