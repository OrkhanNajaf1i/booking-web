import { apiClient } from '../../../shared/api/client';
import type { AuthResponse, RegisterDto,LoginDto } from '../model/types';

export const authApi = {
 
  /**
   * Bu panel yalnız xidmət göstərənlər (həkim, xəstəxana, bərbər, usta)
   * üçündür, ona görə həmişə provider hesabı yaradılır.
   * Müştərilər mobil/web tətbiqindən qeydiyyatdan keçir.
   */
  register: async (dto: RegisterDto): Promise<AuthResponse> => {
    const { data } = await apiClient.post<AuthResponse>('/auth/register', {
      ...dto,
      account_type: 'provider',
    });
    return data;
  },
  login: async (dto: LoginDto): Promise<AuthResponse> => {
    const { data } = await apiClient.post<AuthResponse>('/auth/login',dto)
    return data
  }
};
