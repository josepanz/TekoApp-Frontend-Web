import { keepPreviousData, useQuery } from '@tanstack/react-query';
import {
  browseProfessionals,
  getProfessionalByReference,
  type BrowseProfessionalsParams,
} from './api';

export function useBrowseProfessionalsQuery(params: BrowseProfessionalsParams) {
  return useQuery({
    queryKey: ['browse-professionals', params],
    queryFn: () => browseProfessionals(params),
    placeholderData: keepPreviousData,
  });
}

export function useProfessionalDetailQuery(referenceId: string) {
  return useQuery({
    queryKey: ['professional-detail', referenceId],
    queryFn: () => getProfessionalByReference(referenceId),
  });
}
