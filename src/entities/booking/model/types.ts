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

/** Status → görünən mətn və rəng sinifləri. */
export const BOOKING_STATUS_META: Record<
  BookingStatus,
  { label: string; className: string }
> = {
  pending: {
    label: 'Təsdiq gözləyir',
    className: 'bg-amber-50 text-amber-700 ring-amber-600/20',
  },
  confirmed: {
    label: 'Təsdiqlənib',
    className: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  },
  reschedule_proposed: {
    label: 'Yeni vaxt təklif olunub',
    className: 'bg-sky-50 text-sky-700 ring-sky-600/20',
  },
  cancelled: {
    label: 'Ləğv edilib',
    className: 'bg-rose-50 text-rose-700 ring-rose-600/20',
  },
  completed: {
    label: 'Tamamlanıb',
    className: 'bg-neutral-100 text-neutral-700 ring-neutral-500/20',
  },
  no_show: {
    label: 'Gəlmədi',
    className: 'bg-orange-50 text-orange-700 ring-orange-600/20',
  },
};
