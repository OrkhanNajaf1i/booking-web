import { apiClient } from '../../../shared/api/client';
import type {
    Business,
    BusinessMode,
    MultiBusinessDto,
    SoloBusinessDto,
    UpdateBusinessDTO,
} from '../model/types';

export const businessApi = {
    multi:async (dto: MultiBusinessDto): Promise<Business> => {
        const { data } = await apiClient.post<Business>('/businesses/multi', dto);
        return data;
    },
    solo: async (dto: SoloBusinessDto): Promise<Business> => {
        const { data } = await apiClient.post<Business>('/businesses/solo', dto)
        return data
    },
    getBusiness: async (): Promise<Business> => {
        const { data } = await apiClient.get<Business>('/business')
        return data
    },
    updateBusiness: async (dto:UpdateBusinessDTO): Promise<UpdateBusinessDTO> => {
        const { data } = await apiClient.put<UpdateBusinessDTO>('/business', dto)
        return data
    },

    /** Tək işçi ↔ komanda rejimi. Server rejimə görə dəvəti açır. */
    switchMode: async (mode: BusinessMode): Promise<Business> => {
        const { data } = await apiClient.post<Business>('/business/mode', {
            business_type: mode,
        })
        return data
    }
}