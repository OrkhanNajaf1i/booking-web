import { apiClient } from '@/shared/api/client';

export interface Service {
  id: string;
  business_id: string;
  name: string;
  description: string;
  /** Randevunun uzunluğunu bu təyin edir — availability mühərrikinə gedir */
  duration_minutes: number;
  /** Gəlir hesabatı bunun üzərindən qurulur */
  price: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ServiceDto {
  name: string;
  description: string;
  duration_minutes: number;
  price: number;
}

/**
 * Backend bəzi endpoint-lərdə `{success, data}` zərfi, bəzilərində
 * birbaşa massiv/obyekt qaytarır. Hər iki formanı normallaşdırırıq.
 */
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

export const serviceApi = {
  list: async (): Promise<Service[]> => {
    const { data } = await apiClient.get('/services');
    return unwrapList<Service>(data);
  },

  create: async (dto: ServiceDto): Promise<Service> => {
    const { data } = await apiClient.post('/services', dto);
    return unwrapOne<Service>(data);
  },

  update: async (id: string, dto: ServiceDto): Promise<void> => {
    await apiClient.put(`/services/${id}`, dto);
  },

  /** Soft delete — xidmət deaktiv olunur, keçmiş bronlar qalır. */
  deactivate: async (id: string): Promise<void> => {
    await apiClient.delete(`/services/${id}`);
  },

  // ─── İşçi ↔ xidmət ─────────────────────────────────────────

  /** Həmin işçinin göstərdiyi xidmətlər. */
  listForStaff: async (staffId: string): Promise<Service[]> => {
    const { data } = await apiClient.get(`/staff/${staffId}/services`);
    return unwrapList<Service>(data);
  },

  /** İşçiyə xidmət təyin edir (siyahı tam əvəz olunur). */
  assignToStaff: async (staffId: string, serviceIds: string[]): Promise<void> => {
    await apiClient.post(`/staff/${staffId}/services`, {
      service_ids: serviceIds,
    });
  },

  removeFromStaff: async (staffId: string, serviceId: string): Promise<void> => {
    await apiClient.delete(`/staff/${staffId}/services/${serviceId}`);
  },
};

/** "45 dəq" / "1 saat 30 dəq" */
export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} dəq`;

  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest === 0 ? `${hours} saat` : `${hours} saat ${rest} dəq`;
}

/** "₼ 25" */
export function formatPrice(price: number): string {
  return `₼ ${price.toLocaleString('az-AZ', { maximumFractionDigits: 2 })}`;
}
