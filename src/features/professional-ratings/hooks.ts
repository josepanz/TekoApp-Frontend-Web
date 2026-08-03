import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { toast } from 'sonner';
import { ApiError } from '@/core/api-client/errors';
import { getMyReviews, rateClient, type GetMyReviewsParams } from './api';

export function useMyReviewsQuery(
  professionalId: number | undefined,
  params: GetMyReviewsParams,
) {
  return useQuery({
    queryKey: ['professional-reviews', professionalId, params],
    queryFn: () => getMyReviews(professionalId as number, params),
    enabled: professionalId !== undefined,
    placeholderData: keepPreviousData,
  });
}

export function useRateClientMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: rateClient,
    onSuccess: () => {
      toast.success('Calificación enviada');
      void queryClient.invalidateQueries({
        queryKey: ['professional-services'],
      });
    },
    onError: (error) => {
      toast.error(
        error instanceof ApiError
          ? error.message
          : 'No se pudo enviar la calificación. Intentá de nuevo.',
      );
    },
  });
}
