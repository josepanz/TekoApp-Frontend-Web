import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { getAdminContractsQueue, type GetAdminContractsParams } from './api';

export function useAdminContractsQueueQuery(params: GetAdminContractsParams) {
  return useQuery({
    queryKey: ['contracts', 'queue', params],
    queryFn: () => getAdminContractsQueue(params),
    placeholderData: keepPreviousData,
  });
}
