import { apiClient } from '@/shared/api/client';
import type {
  ApiEnvelope,
  AvailabilityQuery,
  AvailabilityResult,
  BulkWorkingHoursDto,
  CreateTimeOffDto,
  ScheduleSettings,
  SetWorkingHoursDto,
  TimeOff,
  UpdateScheduleSettingsDto,
  WorkingHours,
} from '../model/types';

export const availabilityApi = {
  /** Boş vaxtları gətirir — hesablama backend-də olur, cache-lənmir. */
  getAvailability: async (query: AvailabilityQuery): Promise<AvailabilityResult> => {
    const { data } = await apiClient.get<ApiEnvelope<AvailabilityResult>>('/availability', {
      params: query,
    });
    return data.data;
  },

  // ─── İş saatları ───────────────────────────────────────────

  listWorkingHours: async (staffId: string): Promise<WorkingHours[]> => {
    const { data } = await apiClient.get<ApiEnvelope<WorkingHours[]>>(
      '/availability/working-hours',
      { params: { staff_id: staffId } }
    );
    return data.data ?? [];
  },

  setWorkingHours: async (dto: SetWorkingHoursDto): Promise<WorkingHours> => {
    const { data } = await apiClient.post<ApiEnvelope<WorkingHours>>(
      '/availability/working-hours',
      dto
    );
    return data.data;
  },

  /** Bütün həftəni bir sorğuda yazır. */
  bulkSetWorkingHours: async (dto: BulkWorkingHoursDto): Promise<WorkingHours[]> => {
    const { data } = await apiClient.put<ApiEnvelope<WorkingHours[]>>(
      '/availability/working-hours',
      dto
    );
    return data.data ?? [];
  },

  deleteWorkingHours: async (staffId: string, dayOfWeek: number): Promise<void> => {
    await apiClient.delete('/availability/working-hours', {
      params: { staff_id: staffId, day_of_week: dayOfWeek },
    });
  },

  // ─── Qrafik ayarları ───────────────────────────────────────

  getSettings: async (staffId?: string): Promise<ScheduleSettings> => {
    const { data } = await apiClient.get<ApiEnvelope<ScheduleSettings>>(
      '/availability/settings',
      { params: staffId ? { staff_id: staffId } : undefined }
    );
    return data.data;
  },

  updateSettings: async (dto: UpdateScheduleSettingsDto): Promise<ScheduleSettings> => {
    const { data } = await apiClient.put<ApiEnvelope<ScheduleSettings>>(
      '/availability/settings',
      dto
    );
    return data.data;
  },

  // ─── Time off ──────────────────────────────────────────────

  listTimeOff: async (staffId: string, from?: string, to?: string): Promise<TimeOff[]> => {
    const { data } = await apiClient.get<ApiEnvelope<TimeOff[]>>('/availability/time-off', {
      params: { staff_id: staffId, from, to },
    });
    return data.data ?? [];
  },

  createTimeOff: async (dto: CreateTimeOffDto): Promise<TimeOff> => {
    const { data } = await apiClient.post<ApiEnvelope<TimeOff>>('/availability/time-off', dto);
    return data.data;
  },

  deleteTimeOff: async (id: string): Promise<void> => {
    await apiClient.delete(`/availability/time-off/${id}`);
  },
};
