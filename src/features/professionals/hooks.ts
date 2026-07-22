import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  getProfessionals,
  suspendProfessional,
  verifyProfessional,
  type GetProfessionalsParams,
  type SuspendProfessionalRequest,
  type VerifyProfessionalRequest,
} from './api';

export function useProfessionalsQuery(params: GetProfessionalsParams) {
  return useQuery({
    queryKey: ['professionals', params],
    queryFn: () => getProfessionals(params),
    placeholderData: keepPreviousData,
  });
}

export function useVerifyProfessionalMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: VerifyProfessionalRequest }) =>
      verifyProfessional(id, dto),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['professionals'] });
      toast.success('Profesional verificado correctamente.');
    },
    onError: () => {
      toast.error('No se pudo verificar al profesional. Intentá de nuevo.');
    },
  });
}

export function useSuspendProfessionalMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      dto,
    }: {
      id: number;
      dto: SuspendProfessionalRequest;
    }) => suspendProfessional(id, dto),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['professionals'] });
      toast.success('Profesional suspendido correctamente.');
    },
    onError: () => {
      toast.error('No se pudo suspender al profesional. Intentá de nuevo.');
    },
  });
}
