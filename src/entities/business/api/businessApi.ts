import { apiClient } from '../../../shared/api/client';
import type { Business, MultiBusinessDto, SoloBusinessDto, UpdateBusinessDTO } from '../model/types';

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
    }
}