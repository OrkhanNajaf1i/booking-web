import { apiClient } from '../../../shared/api/client';
import type { Business, MultiBusinessDto, SoloBusinessDto } from '../model/types';

export const businessApi = {
    multi:async (dto: MultiBusinessDto): Promise<Business> => {
        const { data } = await apiClient.post<Business>('/businesses/multi', dto);
        return data;
    },
    solo: async (dto: SoloBusinessDto): Promise<Business> => {
        const { data } = await apiClient.post<Business>('/businesses/solo', dto)
        return data
    }
}