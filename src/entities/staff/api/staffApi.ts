import { apiClient } from '@/shared/api/client';

export type StaffRole = 'admin' | 'manager' | 'staff';

export interface StaffMember {
  /**
   * Biznes sahibi. Sahib işçi siyahısından silinmir — tək işləyəndə
   * bu, yeganə işçini silmək olardı; komandada isə biznesi idarə edən
   * adam qalmazdı. Qadağa serverdə tətbiq olunur, bu sahə yalnız
   * düyməni gizlətmək üçündür.
   */
  is_owner?: boolean;
  id: string;
  user_id: string;
  business_id?: string;
  location_id?: string;
  role: StaffRole | string;
  title?: string;
  department?: string;
  bio?: string;
  status: string;
  /** ListStaff cavabında user məlumatı da qoşulur. */
  full_name?: string;
  email?: string;
  phone?: string;
  avatar?: string;
  joined_at?: string;
}

export interface BusinessInvite {
  id: string;
  business_id: string;
  invited_email: string;
  invited_phone?: string;
  role: StaffRole | string;
  token: string;
  expires_at: string;
  used: boolean;
  created_at: string;
}

export interface InviteStaffDto {
  email: string;
  phone?: string;
  role: StaffRole;
  location_id?: string;
}

export interface UpdateStaffDto {
  role?: StaffRole;
  title?: string;
  department?: string;
  bio?: string;
  hourly_rate?: number;
  location_id?: string;
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

function unwrapOne<T>(payload: unknown): T | null {
  const envelope = payload as { data?: unknown } | null;
  if (envelope && envelope.data && typeof envelope.data === 'object') {
    return envelope.data as T;
  }
  return (payload as T) ?? null;
}

export const staffApi = {
  list: async (): Promise<StaffMember[]> => {
    const { data } = await apiClient.get('/staff');
    return unwrapList<StaffMember>(data);
  },

  getById: async (id: string): Promise<StaffMember | null> => {
    const { data } = await apiClient.get(`/staff/${id}`);
    return unwrapOne<StaffMember>(data);
  },

  update: async (id: string, dto: UpdateStaffDto): Promise<void> => {
    await apiClient.put(`/staff/${id}`, dto);
  },

  /** Soft delete — işçi deaktiv olunur, məlumatı qalır. */
  deactivate: async (id: string): Promise<void> => {
    await apiClient.delete(`/staff/${id}`);
  },

  /**
   * İşçi dəvəti.
   *
   * Birbaşa staff profili yaratmaq `user_id` tələb edir, yəni şəxsin
   * onsuz da hesabı olmalıdır. Ona görə adi yol dəvətdir: backend token
   * yaradır, şəxs onu qəbul edəndə həm hesabı, həm profili qurulur.
   */
  invite: async (dto: InviteStaffDto): Promise<string> => {
    const { data } = await apiClient.post('/staff/invites', dto);

    const envelope = data as { data?: unknown; token?: unknown } | null;
    const token =
      (typeof envelope?.token === 'string' && envelope.token) ||
      (typeof envelope?.data === 'string' && envelope.data) ||
      (envelope?.data as { token?: string } | undefined)?.token;

    return token ?? '';
  },
};

/** Rol → görünən ad. */
export const STAFF_ROLE_LABELS: Record<string, string> = {
  admin: 'Administrator',
  manager: 'Menecer',
  staff: 'İşçi',
};
