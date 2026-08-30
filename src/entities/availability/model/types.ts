// Availability — boş vaxtlar backend-də runtime-da hesablanır.
// Burada saxlanılan yalnız qaydalardır: iş saatı, nahar fasiləsi, slot addımı.

export type SlotState =
  | 'available'
  | 'booked'
  | 'blocked'
  | 'past'
  | 'too_soon'
  | 'too_far';

export interface TimeSlot {
  start: string; // ISO 8601
  end: string;
  duration_mins: number;
  state: SlotState;
  available: boolean;
}

export interface BreakInfo {
  start: string; // "13:00"
  end: string;   // "14:00"
}

export interface DayAvailability {
  date: string;       // "2026-09-01"
  day_of_week: number; // 0=Bazar ... 6=Şənbə
  is_workday: boolean;
  opens_at?: string;
  closes_at?: string;
  break?: BreakInfo;
  slots: TimeSlot[];
}

export interface AvailabilityResult {
  staff_id: string;
  service_id?: string;
  timezone: string;
  duration_mins: number;
  slot_step_mins: number;
  days: DayAvailability[];
}

export interface AvailabilityQuery {
  staff_id: string;
  service_id?: string;
  from?: string; // "2026-09-01"
  to?: string;
}

// ─── İş saatları ─────────────────────────────────────────────

export interface WorkingHours {
  id: string;
  business_id: string;
  staff_id: string;
  day_of_week: number;
  start_time: string;   // "09:00"
  end_time: string;     // "18:00"
  break_enabled: boolean;
  break_start?: string; // "13:00"
  break_end?: string;   // "14:00"
  is_active: boolean;
}

export interface SetWorkingHoursDto {
  staff_id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  break_enabled: boolean;
  break_start?: string;
  break_end?: string;
  is_active: boolean;
}

export interface BulkWorkingHoursDto {
  staff_id: string;
  days: SetWorkingHoursDto[];
}

// ─── Qrafik ayarları ─────────────────────────────────────────

export interface ScheduleSettings {
  id: string;
  business_id: string;
  staff_id?: string;
  timezone: string;
  /** Müştəriyə göstərilən vaxtların addımı: 16, 30, 60 ... */
  slot_step_mins: number;
  /** Xidmət seçilməyibsə randevunun uzunluğu */
  default_duration_mins: number;
  buffer_before_mins: number;
  buffer_after_mins: number;
  /** Ən azı bu qədər dəqiqə əvvəlcədən bron */
  min_notice_mins: number;
  max_advance_days: number;
  /** true → bron təsdiq gözləmədən confirmed olur */
  auto_confirm: boolean;
  allow_reschedule_proposal: boolean;
}

export type UpdateScheduleSettingsDto = Partial<
  Omit<ScheduleSettings, 'id' | 'business_id'>
> & { staff_id?: string };

// ─── Time off ────────────────────────────────────────────────

export interface TimeOff {
  id: string;
  business_id: string;
  staff_id: string;
  start_at: string;
  end_at: string;
  reason: string;
}

export interface CreateTimeOffDto {
  staff_id: string;
  start_at: string;
  end_at: string;
  reason: string;
}

// ─── Backend cavab zərfi ─────────────────────────────────────

export interface ApiEnvelope<T> {
  success: boolean;
  message?: string;
  data: T;
}

export const DAY_NAMES = [
  'Bazar',
  'Bazar ertəsi',
  'Çərşənbə axşamı',
  'Çərşənbə',
  'Cümə axşamı',
  'Cümə',
  'Şənbə',
] as const;
