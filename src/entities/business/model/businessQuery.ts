import { queryOptions, useQuery } from '@tanstack/react-query';
import { businessApi } from '../api/businessApi';
import type { Business } from './types';

export const businessQueryOptions = () =>
  queryOptions<Business>({
    queryKey: ['business'],
    queryFn: ()=> businessApi.getBusiness(),
    staleTime: 1000 * 60 * 10,     
    retry: 2,
  });

export const useBusinessQuery = () =>
  useQuery(businessQueryOptions());