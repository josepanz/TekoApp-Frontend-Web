import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { toast } from 'sonner';
import { ApiError } from '@/core/api-client/errors';
import {
  acceptService,
  getPendingServices,
  type GetPendingServicesParams,
} from './api';

export function usePendingServicesQuery(params: GetPendingServicesParams) {
  return useQuery({
    queryKey: ['professional-requests', params],
    queryFn: () => getPendingServices(params),
    placeholderData: keepPreviousData,
    // El 403 de un profesional no aprobado lo explica la propia tabla (y el banner de estado): no
    // debe tumbar toda el area /pro con la pantalla de sin acceso del error boundary.
    throwOnError: false,
    // Un 4xx (p. ej. 403 de un profesional no aprobado) no se arregla reintentando.
    retry: (failureCount, error) =>
      !(error instanceof ApiError && error.status < 500) && failureCount < 2,
  });
}

export function useAcceptServiceMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: acceptService,
    onSuccess: () => {
      toast.success('Servicio aceptado');
      void queryClient.invalidateQueries({
        queryKey: ['professional-requests'],
      });
      void queryClient.invalidateQueries({
        queryKey: ['professional-services'],
      });
    },
    onError: (error) => {
      toast.error(
        error instanceof ApiError
          ? error.message
          : 'No se pudo aceptar el servicio. Intentá de nuevo.',
      );
    },
  });
}
