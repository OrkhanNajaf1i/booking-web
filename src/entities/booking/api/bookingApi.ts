import { apiClient } from '@/shared/api/client';
import type { ApiEnvelope } from '@/entities/availability/model/types';
import type {
  Booking,
  BookingFilters,
  CreateBookingDto,
  ProposeRescheduleDto,
  RespondToProposalDto,
} from '../model/types';

export const bookingApi = {
  list: async (filters?: BookingFilters): Promise<Booking[]> => {
    const { data } = await apiClient.get<ApiEnvelope<Booking[]>>('/bookings', {
      params: filters,
    });
    return data.data ?? [];
  },

  /** Müştəri tətbiqi: istifadəçinin bütün bizneslərdəki bronları. */
  listMine: async (filters?: BookingFilters): Promise<Booking[]> => {
    const { data } = await apiClient.get<ApiEnvelope<Booking[]>>('/bookings/my', {
      params: filters,
    });
    return data.data ?? [];
  },

  getById: async (id: string): Promise<Booking> => {
    const { data } = await apiClient.get<ApiEnvelope<Booking>>(`/bookings/${id}`);
    return data.data;
  },

  create: async (dto: CreateBookingDto): Promise<Booking> => {
    const { data } = await apiClient.post<ApiEnvelope<Booking>>('/bookings', dto);
    return data.data;
  },

  // ─── Provider axını ────────────────────────────────────────

  confirm: async (id: string): Promise<Booking> => {
    const { data } = await apiClient.post<ApiEnvelope<Booking>>(`/bookings/${id}/confirm`);
    return data.data;
  },

  /** Bərbər/həkim başqa vaxt təklif edir — müştəriyə anında bildiriş gedir. */
  proposeReschedule: async (id: string, dto: ProposeRescheduleDto): Promise<Booking> => {
    const { data } = await apiClient.post<ApiEnvelope<Booking>>(
      `/bookings/${id}/propose`,
      dto
    );
    return data.data;
  },

  complete: async (id: string): Promise<Booking> => {
    const { data } = await apiClient.post<ApiEnvelope<Booking>>(`/bookings/${id}/complete`);
    return data.data;
  },

  markNoShow: async (id: string): Promise<Booking> => {
    const { data } = await apiClient.post<ApiEnvelope<Booking>>(`/bookings/${id}/no-show`);
    return data.data;
  },

  // ─── Müştəri axını ─────────────────────────────────────────

  respondToProposal: async (id: string, dto: RespondToProposalDto): Promise<Booking> => {
    const { data } = await apiClient.post<ApiEnvelope<Booking>>(
      `/bookings/${id}/respond`,
      dto
    );
    return data.data;
  },

  cancel: async (id: string, reason?: string): Promise<Booking> => {
    const { data } = await apiClient.post<ApiEnvelope<Booking>>(`/bookings/${id}/cancel`, {
      reason: reason ?? '',
    });
    return data.data;
  },
};
