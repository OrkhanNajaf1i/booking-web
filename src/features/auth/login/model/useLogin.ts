import { toast } from 'sonner';
import { authApi } from "@/entities/session/api/authApi";
import type { LoginDto } from "@/entities/session/model/types";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from 'react-router-dom';


export function useLogin() {
    const navigate = useNavigate()
    return useMutation({
        mutationFn: (dto:LoginDto) => authApi.login(dto),
        onSuccess: (data: any) => {
            localStorage.setItem("accessToken", data.access_token)
            localStorage.setItem("refreshToken", data.refresh_token)
            navigate('/onboarding')
            toast.success(`Xoş gəldin, ${data.user.full_name}!`);
        },
        onError: (error: Error | any) => {
            const message = error?.response?.data?.message || 'Hesaba daxil olmaq mümkün olmadı.';
            toast.error(message)   
        }
    })
}