import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { businessApi } from '@/entities/business/api/businessApi';
import type { Business, MultiBusinessDto } from '@/entities/business/model/types';
import type { RefreshResponse } from '@/entities/session/model/types';
import { toast } from 'sonner';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
export function useCreateMultiBusiness() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: MultiBusinessDto) => businessApi.multi(dto),

    onSuccess: async (business: Business) => {
      const storedRefreshToken = localStorage.getItem('refreshToken');

      const { data: refreshResponse } = await axios.post<RefreshResponse>(
        `${API_BASE_URL}/auth/refresh`,
        { refresh_token: storedRefreshToken }
      );

      localStorage.setItem('accessToken', refreshResponse.data.access_token);
      // localStorage.setItem("business_id", business.id)
      queryClient.setQueryData(['my-business'], business);
      toast.success('Biznes uğurla yaradıldı!');
      navigate(`/business/${business.id}/dashboard`);
    },

    onError: (error: any) => {
      const message =
        error?.response?.data?.message || 'Biznes yaratmaq mümkün olmadı.';
      toast.error(message);
    },
  });
}
