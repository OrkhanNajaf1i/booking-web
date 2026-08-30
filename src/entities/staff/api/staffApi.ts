import { apiClient } from '@/shared/api/client';

export interface StaffMember {
  id: string;
  user_id: string;
  business_id: string;
  location_id?: string;
  role: string;
  title?: string;
  department?: string;
  bio?: string;
  status: string;
  /** Backend ListStaff-da user məlumatını da qoşur. */
  full_name?: string;
  email?: string;
  phone?: string;
}

/**
 * Backend bəzi endpoint-lərdə `{success, data}` zərfi, bəzilərində
 * birbaşa massiv qaytarır. Hər iki formanı normallaşdırırıq.
 */
function unwrap<T>(payload: unknown): T[] {
  if (Array.isArray(payload)) return payload as T[];

  const envelope = payload as { data?: unknown } | null;
  if (envelope && Array.isArray(envelope.data)) return envelope.data as T[];

  return [];
}

export const staffApi = {
  list: async (): Promise<StaffMember[]> => {
    const { data } = await apiClient.get('/staff');
    return unwrap<StaffMember>(data);
  },

  getById: async (id: string): Promise<StaffMember | null> => {
    const { data } = await apiClient.get(`/staff/${id}`);
    const envelope = data as { data?: StaffMember } | StaffMember;
    return (envelope as { data?: StaffMember }).data ?? (envelope as StaffMember) ?? null;
  },
};
