import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { ApiError } from '@/core/api-client/errors';
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
    // Un 404 (profesional no aprobado u inexistente) no se arregla reintentando.
    retry: (failureCount, error) =>
      !(error instanceof ApiError && error.status < 500) && failureCount < 2,
  });
}
