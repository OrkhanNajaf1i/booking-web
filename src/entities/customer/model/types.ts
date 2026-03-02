export interface CustomerDto {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  notes: string;
  status: string;
  total_bookings: number;
  last_booking_at: string;
  created_at: string;
  updated_at: string;
}

export interface CustomerListResponse {
  data: CustomerDto[];
  page: number;
  page_size: number;
  total: number;
  total_pages: number;
}

export interface CustomerFilters {
  page?: number;
  page_size?: number;
}
