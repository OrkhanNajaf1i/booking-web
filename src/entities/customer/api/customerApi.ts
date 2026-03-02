import { apiClient } from "@/shared/api/client";
import type { CustomerListResponse, CustomerFilters } from "../model/types";

export const customerApi = {
    getList: async (filters?: CustomerFilters): Promise<CustomerListResponse> => {
        const { data } = await apiClient.get<CustomerListResponse>('/customers',
            {
                params: {
                    page: filters?.page || 0,
                    page_size:filters?.page_size || 20
                }
            }
        )
        return data
    }
}