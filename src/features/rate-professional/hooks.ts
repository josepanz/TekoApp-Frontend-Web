import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { ApiError } from '@/core/api-client/errors';
import { rateProfessional } from './api';

export function useRateProfessionalMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: rateProfessional,
    onSuccess: () => {
      toast.success('Calificación enviada');
      void queryClient.invalidateQueries({ queryKey: ['my-client-services'] });
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
