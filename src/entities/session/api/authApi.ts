import { apiClient } from '../../../shared/api/client';
import type { AuthResponse, RegisterDto,LoginDto } from '../model/types';

export const authApi = {
 
  register: async (dto: RegisterDto): Promise<AuthResponse> => {
    const { data } = await apiClient.post<AuthResponse>('/auth/register', dto);
    return data;
  },
  login: async (dto: LoginDto): Promise<AuthResponse> => {
    const { data } = await apiClient.post<AuthResponse>('/auth/login',dto)
    return data
  }
};
