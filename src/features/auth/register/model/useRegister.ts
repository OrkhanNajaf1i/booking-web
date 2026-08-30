import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authApi } from '@/entities/session/api/authApi';
import type { RegisterDto, AuthResponse } from '@/entities/session/model/types';
import { toast } from 'sonner';
import { extractErrorMessage } from '@/shared/api/errors';

export function useRegister() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (dto: RegisterDto) => authApi.register(dto),

    onSuccess: (data: AuthResponse) => {
      localStorage.setItem('accessToken', data.access_token);
      localStorage.setItem('refreshToken', data.refresh_token);
      navigate('/onboarding');
      toast.success(`Xoş gəldin, ${data.user.full_name}!`);
    },

    onError: (error: unknown) => {
      toast.error(extractErrorMessage(error, 'Hesab yaratmaq mümkün olmadı.'));
    },
  });
}
