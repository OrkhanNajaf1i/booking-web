/**
 * ═══════════════════════════════════════════════════════════════
 * BOOKING DOMAIN TYPES
 * ═══════════════════════════════════════════════════════════════
 * Hər entity üçün AYRICA yaradılır (customer, staff, service...).
 * Backend-in contract-ına uyğun type-lar.
 */

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

// ─────────────────────────────────────────────────────────────────
// Backend-dən gələn booking obyekti
// ─────────────────────────────────────────────────────────────────
export interface Booking {
  id: string;
  business_id: string;
  customer_id: string;
  service_id: string;
  staff_id: string;
  slot_id: string;
  status: BookingStatus;
  start_time: string; // ISO 8601
  end_time: string;
  notes?: string;
  created_at: string;
  updated_at: string;

  // Relations (populate olunmuş halda gəlirsə)
  customer?: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
  service?: {
    id: string;
    name: string;
    duration: number;
    price: number;
  };
  staff?: {
    id: string;
    name: string;
  };
}

// ─────────────────────────────────────────────────────────────────
// Booking yaratmaq üçün DTO
// ─────────────────────────────────────────────────────────────────
export interface CreateBookingDto {
  customer_id: string;
  service_id: string;
  staff_id: string;
  slot_id: string;
  start_time: string;
  end_time: string;
  notes?: string;
}

// ─────────────────────────────────────────────────────────────────
// Booking yeniləmək üçün DTO
// ─────────────────────────────────────────────────────────────────
export interface UpdateBookingDto {
  status?: BookingStatus;
  notes?: string;
}

// ─────────────────────────────────────────────────────────────────
// Filter parametrləri
// ─────────────────────────────────────────────────────────────────
export interface BookingFilters {
  status?: BookingStatus;
  customer_id?: string;
  staff_id?: string;
  date_from?: string;
  date_to?: string;
}

// ─────────────────────────────────────────────────────────────────
// Paginated response (backend-dən)
// ─────────────────────────────────────────────────────────────────
export interface PaginatedBookings {
  data: Booking[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
