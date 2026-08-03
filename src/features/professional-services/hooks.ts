import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { ApiError } from '@/core/api-client/errors';
import {
  completeService,
  getMyServices,
  startService,
  type GetMyServicesParams,
} from './api';

export function useMyServicesQuery(params: GetMyServicesParams) {
  return useQuery({
    queryKey: ['professional-services', params],
    queryFn: () => getMyServices(params),
  });
}

function useServiceTransitionMutation(
  mutationFn: (id: string) => ReturnType<typeof startService>,
  successMessage: string,
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn,
    onSuccess: () => {
      toast.success(successMessage);
      void queryClient.invalidateQueries({
        queryKey: ['professional-services'],
      });
    },
    onError: (error) => {
      toast.error(
        error instanceof ApiError
          ? error.message
          : 'Ocurrió un error inesperado. Intentá de nuevo.',
      );
    },
  });
}

export function useStartServiceMutation() {
  return useServiceTransitionMutation(startService, 'Servicio iniciado');
}

export function useCompleteServiceMutation() {
  return useServiceTransitionMutation(completeService, 'Servicio completado');
}
