import { useQuery } from '@tanstack/react-query';
import { getMyRatingStats } from './api';

export function useMyRatingStatsQuery() {
  return useQuery({
    queryKey: ['my-rating-stats'],
    queryFn: getMyRatingStats,
  });
}
