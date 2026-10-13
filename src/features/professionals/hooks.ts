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
  getProfessionalStatusHistory,
  getProfessionals,
  reactivateProfessional,
  suspendProfessional,
  verifyProfessional,
  type ExportProfessionalsParams,
  type GetProfessionalsParams,
  type ReactivateProfessionalRequest,
  type SuspendProfessionalRequest,
  type VerifyProfessionalRequest,
} from './api';
import { ApiError } from '@/core/api-client/errors';
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

export function useProfessionalStatusHistoryQuery(
  id: number,
  page: number,
  pageSize: number,
) {
  return useQuery({
    queryKey: ['professionals', 'status-history', id, page, pageSize],
    queryFn: () => getProfessionalStatusHistory(id, { page, pageSize }),
    placeholderData: keepPreviousData,
  });
}

// El 400 de validacion por campo (p. ej. `reason`) lo muestra el formulario junto al campo, sin toast.
function isFieldValidationError(error: unknown): boolean {
  return (
    error instanceof ApiError &&
    error.status === 400 &&
    error.fieldErrors.length > 0
  );
}

function transitionErrorMessage(
  error: unknown,
  fallback: string,
  conflict: string,
): string {
  return error instanceof ApiError && error.status === 409
    ? conflict
    : fallback;
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
    onError: (error) => {
      if (isFieldValidationError(error)) return;
      toast.error(
        transitionErrorMessage(
          error,
          'No se pudo verificar al profesional. Intentá de nuevo.',
          'El profesional ya no está en un estado que permita verificarlo. Actualizá la lista.',
        ),
      );
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
    onError: (error) => {
      if (isFieldValidationError(error)) return;
      toast.error(
        transitionErrorMessage(
          error,
          'No se pudo suspender al profesional. Intentá de nuevo.',
          'Solo se puede suspender a un profesional aprobado; su estado cambió. Actualizá la lista.',
        ),
      );
    },
  });
}

export function useReactivateProfessionalMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      dto,
    }: {
      id: number;
      dto: ReactivateProfessionalRequest;
    }) => reactivateProfessional(id, dto),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['professionals'] });
      toast.success('Profesional reactivado correctamente.');
    },
    onError: (error) => {
      if (isFieldValidationError(error)) return;
      toast.error(
        transitionErrorMessage(
          error,
          'No se pudo reactivar al profesional. Intentá de nuevo.',
          'Solo se puede reactivar a un profesional suspendido, y su cuenta debe estar activa; su estado cambió. Actualizá la lista.',
        ),
      );
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
