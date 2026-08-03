import { useQuery } from '@tanstack/react-query';
import { getDashboardStats } from './api';

export function useDashboardStatsQuery() {
  return useQuery({
    queryKey: ['analytics', 'dashboard'],
    queryFn: getDashboardStats,
  });
}
