import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { getServices, type GetServicesParams } from './api';

export function useServicesQuery(params: GetServicesParams) {
  return useQuery({
    queryKey: ['services', params],
    queryFn: () => getServices(params),
    placeholderData: keepPreviousData,
  });
}
