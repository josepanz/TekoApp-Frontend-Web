import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { getAuditLogs, type GetAuditLogsParams } from './api';

export function useAuditLogsQuery(params: GetAuditLogsParams) {
  return useQuery({
    queryKey: ['audit-log', params],
    queryFn: () => getAuditLogs(params),
    placeholderData: keepPreviousData,
  });
}
