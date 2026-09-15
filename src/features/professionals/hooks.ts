import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  exportProfessionals,
  getProfessionalByReference,
  getProfessionals,
  suspendProfessional,
  verifyProfessional,
  type ExportProfessionalsParams,
  type GetProfessionalsParams,
  type SuspendProfessionalRequest,
  type VerifyProfessionalRequest,
} from './api';
import { triggerFileDownload } from '@/lib/trigger-file-download';

export function useProfessionalsQuery(params: GetProfessionalsParams) {
  return useQuery({
    queryKey: ['professionals', params],
    queryFn: () => getProfessionals(params),
    placeholderData: keepPreviousData,
  });
}

export function useProfessionalDetailQuery(referenceId: string) {
  return useQuery({
    queryKey: ['professionals', 'detail', referenceId],
    queryFn: () => getProfessionalByReference(referenceId),
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

// Dispara la descarga del CSV con los filtros activos de la tabla (nunca "exportar todo"
// ignorando el filtro visible) — ver `admin-data-export.md`.
export function useExportProfessionalsMutation() {
  return useMutation({
    mutationFn: (params: ExportProfessionalsParams) =>
      exportProfessionals(params),
    onSuccess: ({ blob, filename }) => triggerFileDownload(blob, filename),
    onError: () => {
      toast.error('No se pudo generar el archivo. Intentá de nuevo.');
    },
  });
}
