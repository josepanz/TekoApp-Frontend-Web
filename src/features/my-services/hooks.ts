import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { ApiError } from '@/core/api-client/errors';
import {
  cancelService,
  getMyClientServices,
  type CancelServiceRequest,
  type GetMyClientServicesParams,
} from './api';

export function useMyClientServicesQuery(params: GetMyClientServicesParams) {
  return useQuery({
    queryKey: ['my-client-services', params],
    queryFn: () => getMyClientServices(params),
  });
}

export function useCancelServiceMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: CancelServiceRequest }) =>
      cancelService(id, dto),
    onSuccess: () => {
      toast.success('Servicio cancelado');
      void queryClient.invalidateQueries({ queryKey: ['my-client-services'] });
    },
    onError: (error) => {
      // 409: el servicio ya cambió de estado (p. ej. un profesional lo inició): se refresca la
      // lista para mostrar el estado real (DEF-WEB-011).
      if (error instanceof ApiError && error.status === 409) {
        void queryClient.invalidateQueries({
          queryKey: ['my-client-services'],
        });
      }
      toast.error(
        error instanceof ApiError
          ? error.message
          : 'No se pudo cancelar el servicio. Intentá de nuevo.',
      );
    },
  });
}
