export type NotificationType =
  | 'booking.created'
  | 'booking.confirmed'
  | 'booking.reschedule_proposed'
  | 'booking.reschedule_accepted'
  | 'booking.reschedule_declined'
  | 'booking.cancelled'
  | 'booking.completed'
  | 'booking.no_show'
  | 'booking.reminder';

export interface AppNotification {
  id: string;
  business_id?: string;
  user_id: string;
  booking_id?: string;
  type: NotificationType;
  title: string;
  body: string;
  payload: Record<string, unknown>;
  is_read: boolean;
  read_at?: string;
  created_at: string;
}

export interface NotificationListResult {
  items: AppNotification[];
  unread_count: number;
}

/**
 * WebSocket-dən gələn zərf.
 * `connection.ready` bağlantı qurulanda bir dəfə gəlir.
 */
export interface RealtimeEnvelope {
  type: NotificationType | 'connection.ready';
  user_id: string;
  business_id?: string;
  booking_id?: string;
  title: string;
  body: string;
  payload?: Record<string, unknown>;
  created_at: string;
}

export const NOTIFICATION_ICONS: Record<string, string> = {
  'booking.created': '📩',
  'booking.confirmed': '✅',
  'booking.reschedule_proposed': '🔄',
  'booking.reschedule_accepted': '👍',
  'booking.reschedule_declined': '↩️',
  'booking.cancelled': '❌',
  'booking.completed': '🏁',
  'booking.no_show': '🚫',
  'booking.reminder': '⏰',
};
