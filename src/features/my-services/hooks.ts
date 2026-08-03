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
      toast.error(
        error instanceof ApiError
          ? error.message
          : 'No se pudo cancelar el servicio. Intentá de nuevo.',
      );
    },
  });
}
