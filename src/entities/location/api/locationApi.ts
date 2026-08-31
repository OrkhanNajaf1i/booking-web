import { apiClient } from '@/shared/api/client';

export interface Location {
  id: string;
  business_id: string;
  name: string;
  address?: string;
  city?: string;
  phone?: string;
  /** Xəritədə seçilibsə dolur; ikisi birlikdə ya var, ya yoxdur */
  latitude?: number;
  longitude?: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface LocationDto {
  name: string;
  address?: string;
  city?: string;
  phone?: string;
  latitude?: number;
  longitude?: number;
}

function unwrapList<T>(payload: unknown): T[] {
  if (Array.isArray(payload)) return payload as T[];

  const envelope = payload as { data?: unknown } | null;
  if (envelope && Array.isArray(envelope.data)) return envelope.data as T[];

  return [];
}

function unwrapOne<T>(payload: unknown): T {
  const envelope = payload as { data?: unknown } | null;
  if (envelope && envelope.data && typeof envelope.data === 'object') {
    return envelope.data as T;
  }
  return payload as T;
}

export const locationApi = {
  list: async (): Promise<Location[]> => {
    const { data } = await apiClient.get('/locations');
    return unwrapList<Location>(data);
  },

  create: async (dto: LocationDto): Promise<Location> => {
    const { data } = await apiClient.post('/locations', dto);
    return unwrapOne<Location>(data);
  },

  update: async (id: string, dto: LocationDto): Promise<void> => {
    await apiClient.put(`/locations/${id}`, dto);
  },

  /** Yumşaq silmə — filial deaktiv olur, məlumatı qalır. */
  deactivate: async (id: string): Promise<void> => {
    await apiClient.delete(`/locations/${id}`);
  },

  /** Deaktiv filialı geri qaytarır. */
  activate: async (id: string): Promise<void> => {
    await apiClient.post(`/locations/${id}/activate`);
  },

  /**
   * Həmişəlik silmə.
   *
   * Filiala bağlı randevu və ya işçi varsa server 409 qaytarır —
   * keçmiş randevunun "harada olub" məlumatı itməməlidir.
   */
  remove: async (id: string): Promise<void> => {
    await apiClient.delete(`/locations/${id}/permanent`);
  },
};
