import type { BadgeTone } from '@/shared/ui/primitives';

export type BookingStatus =
  | 'pending'
  | 'confirmed'
  | 'reschedule_proposed'
  | 'cancelled'
  | 'completed'
  | 'no_show';

export interface Booking {
  id: string;
  business_id: string;
  customer_id: string;
  /** Provayder siyahısında dolur — müştəriyə zəng etmək üçün. */
  customer_name?: string;
  customer_phone?: string;
  staff_id: string;
  service_id?: string;
  location_id?: string;

  start_time: string;
  end_time: string;
  duration_mins: number;
  status: BookingStatus;
  notes: string;

  /** Provider alternativ vaxt təklif edəndə dolur */
  proposed_start_time?: string;
  proposed_end_time?: string;
  proposed_by?: string;
  proposal_note?: string;
  proposed_at?: string;

  cancel_reason?: string;
  cancelled_by?: string;
  confirmed_at?: string;

  created_at: string;
  updated_at: string;
}

export interface CreateBookingDto {
  customer_id: string;
  staff_id: string;
  service_id?: string;
  location_id?: string;
  /** ISO 8601 — availability-dən gələn slot.start */
  start_time: string;
  notes?: string;
}

export interface ProposeRescheduleDto {
  new_start_time: string;
  note?: string;
}

export interface RespondToProposalDto {
  accept: boolean;
  note?: string;
}

export interface BookingFilters {
  staff_id?: string;
  customer_id?: string;
  status?: BookingStatus;
  from?: string;
  to?: string;
  limit?: number;
  offset?: number;
}

/**
 * Status → görünən mətn və nişan tonu.
 *
 * Rəng sinifləri əvvəl burada xam Tailwind adları kimi yazılırdı
 * (`bg-amber-50 …`). İndi yalnız ton adı saxlanılır — rəngin özü
 * `Badge` parçasında bir yerdə təyin olunur, ona görə paletta
 * dəyişəndə bura toxunmaq lazım gəlmir.
 */
export const BOOKING_STATUS_META: Record<
  BookingStatus,
  { label: string; tone: BadgeTone }
> = {
  pending: { label: 'Təsdiq gözləyir', tone: 'warning' },
  confirmed: { label: 'Təsdiqlənib', tone: 'success' },
  reschedule_proposed: { label: 'Yeni vaxt təklif olunub', tone: 'info' },
  cancelled: { label: 'Ləğv edilib', tone: 'danger' },
  completed: { label: 'Tamamlanıb', tone: 'neutral' },
  no_show: { label: 'Gəlmədi', tone: 'warning' },
};
