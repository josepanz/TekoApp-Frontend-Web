import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { getServiceById, getServices, type GetServicesParams } from './api';

export function useServicesQuery(params: GetServicesParams) {
  return useQuery({
    queryKey: ['services', params],
    queryFn: () => getServices(params),
    placeholderData: keepPreviousData,
  });
}

export function useServiceDetailQuery(id: string) {
  return useQuery({
    queryKey: ['services', 'detail', id],
    queryFn: () => getServiceById(id),
  });
}
