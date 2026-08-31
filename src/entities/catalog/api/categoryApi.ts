/**
 * Kəşf kateqoriyaları — mobil tətbiqlə eyni taksonomiya.
 *
 * Kateqoriya siyahısı serverdə saxlanılır (`domain/catalog`), burada
 * təkrarlanmır: iki tərəf ayrı-ayrı siyahı saxlasa, biri dəyişəndə
 * digəri səssizcə köhnəlir.
 */
import { apiClient } from '@/shared/api/client';

export interface ServiceCategory {
  /** Filtrdə və bazada işlənən dəyişməz açar */
  slug: string;
  /** İstifadəçiyə görünən ad */
  name: string;
  /** İkon açarı — hər iki tətbiq eyni adlandırmanı işlədir */
  icon: string;
  /** Həmin sahədə neçə biznes var */
  count: number;
}

function unwrap(payload: unknown): ServiceCategory[] {
  if (Array.isArray(payload)) return payload as ServiceCategory[];

  const envelope = payload as { data?: unknown } | null;
  if (envelope && Array.isArray(envelope.data)) {
    return envelope.data as ServiceCategory[];
  }
  return [];
}

export const categoryApi = {
  /**
   * Seçim siyahısı üçün bütün kateqoriyalar — boşlar da daxil.
   * Müştəri kəşf ekranında isə yalnız dolu olanlar göstərilir.
   */
  listAll: async (): Promise<ServiceCategory[]> => {
    const { data } = await apiClient.get('/public/categories', {
      params: { all: 'true' },
    });
    return unwrap(data);
  },
};
