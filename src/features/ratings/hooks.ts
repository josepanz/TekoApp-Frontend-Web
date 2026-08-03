import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { ApiError } from '@/core/api-client/errors';
import { deleteRating, getRatings } from './api';

export const RATINGS_QUERY_KEY = ['ratings'] as const;

export function useRatingsQuery() {
  return useQuery({
    queryKey: RATINGS_QUERY_KEY,
    queryFn: () => getRatings(),
  });
}

export function useDeleteRatingMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteRating(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: RATINGS_QUERY_KEY });
      toast.success('Calificación eliminada correctamente');
    },
    onError: (error) => {
      const message =
        error instanceof ApiError
          ? error.message
          : 'No se pudo eliminar la calificación. Intentá de nuevo.';
      toast.error(message);
    },
  });
}
