import { useQuery } from '@tanstack/react-query';
import {
  getNearbyProfessionals,
  getOnlineProfessionalsCount,
  type GetNearbyProfessionalsParams,
} from './api';

export function useOnlineProfessionalsCountQuery() {
  return useQuery({
    queryKey: ['locations', 'online-count'],
    queryFn: getOnlineProfessionalsCount,
    // Refresca sola cada 30s — es una métrica en vivo (profesionales conectados ahora mismo).
    refetchInterval: 30_000,
  });
}

export function useNearbyProfessionalsQuery(
  params: GetNearbyProfessionalsParams | undefined,
) {
  return useQuery({
    queryKey: ['locations', 'nearby', params],
    queryFn: () =>
      getNearbyProfessionals(params as GetNearbyProfessionalsParams),
    enabled: params !== undefined,
  });
}
