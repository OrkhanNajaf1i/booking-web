import { toast } from 'sonner';
import { authApi } from "@/entities/session/api/authApi";
import type { AuthResponse, LoginDto } from "@/entities/session/model/types";
import { isProviderRole } from "@/entities/session/model/types";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from 'react-router-dom';
import { extractErrorMessage } from '@/shared/api/errors';

export function useLogin() {
    const navigate = useNavigate()

    return useMutation({
        mutationFn: (dto: LoginDto) => authApi.login(dto),

        onSuccess: (data: AuthResponse) => {
            // Bu panel yalnız xidmət göstərənlər üçündür. Müştəri hesabı ilə
            // girişə icazə versək istifadəçi boş ekranlarla qarşılaşar,
            // çünki onun business konteksti yoxdur.
            if (!isProviderRole(data.user.role)) {
                toast.error('Bu panel xidmət göstərənlər üçündür', {
                    description:
                        'Randevu almaq üçün müştəri tətbiqindən istifadə edin.',
                });
                return;
            }

            localStorage.setItem("accessToken", data.access_token)
            localStorage.setItem("refreshToken", data.refresh_token)
            navigate('/onboarding')
            toast.success(`Xoş gəldin, ${data.user.full_name}!`);
        },

        onError: (error: unknown) => {
            toast.error(extractErrorMessage(error, 'Hesaba daxil olmaq mümkün olmadı.'))
        }
    })
}
