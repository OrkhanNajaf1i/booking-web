import { businessApi } from "@/entities/business/api/businessApi"
import type { UpdateBusinessDTO } from "@/entities/business/model/types"
import { useMutation, useQueryClient } from "@tanstack/react-query"
// import axios from "axios"
// import { useNavigate } from "react-router-dom"
import { toast } from 'sonner';

// const API_BASE_URL= import.meta.env.VITE_API_BASE_URL
export function useUpdateBusiness() {
    // const navigate = useNavigate()
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (dto: UpdateBusinessDTO) => businessApi.updateBusiness(dto),
        onSuccess: async () => { 
            await queryClient.refetchQueries({ queryKey: ['business'] });
            toast.success('Biznes uğurla yeniləndi!');
            // const business = queryClient.getQueryData<Business>(['business']);
            // navigate(`/business/${business?.id}/dashboard`);
        },
        onError: (error:any) => {
            // toast.error('Xəta baş verdi, yenidən cəhd edin.');
            const message = error?.response?.data?.message || 'Xəta baş verdi, yenidən cəhd edin.';
            toast.error(message);
            console.error("When update business => ",error)
        },
    })    
}