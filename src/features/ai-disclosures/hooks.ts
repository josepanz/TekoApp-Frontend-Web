import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { getAiDisclosures, type GetAiDisclosuresParams } from './api';

export function useAiDisclosuresQuery(params: GetAiDisclosuresParams) {
  return useQuery({
    queryKey: ['ai-disclosures', params],
    queryFn: () => getAiDisclosures(params),
    placeholderData: keepPreviousData,
  });
}
