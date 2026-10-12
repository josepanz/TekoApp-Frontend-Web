import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { getCountries, type GetCountriesParams } from './api';

export function useCountriesQuery(params: GetCountriesParams) {
  return useQuery({
    queryKey: ['countries', params],
    queryFn: () => getCountries(params),
    placeholderData: keepPreviousData,
    // El catálogo de países casi no cambia.
    staleTime: 5 * 60 * 1000,
  });
}
