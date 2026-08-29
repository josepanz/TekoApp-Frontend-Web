import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { ApiError } from '@/core/api-client/errors';
import {
  createLegalDocumentVersion,
  getLegalDocumentVersions,
  updateLegalDocumentVersion,
  type CreateLegalDocumentVersionDto,
  type UpdateLegalDocumentVersionDto,
} from './api';

export const LEGAL_DOCUMENT_VERSIONS_QUERY_KEY = ['legal-document-versions'];

function getErrorMessage(error: unknown, fallback: string): string {
  return error instanceof ApiError ? error.message : fallback;
}

export function useLegalDocumentVersionsQuery() {
  return useQuery({
    queryKey: LEGAL_DOCUMENT_VERSIONS_QUERY_KEY,
    queryFn: getLegalDocumentVersions,
  });
}

export function useCreateLegalDocumentVersionMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateLegalDocumentVersionDto) =>
      createLegalDocumentVersion(dto),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: LEGAL_DOCUMENT_VERSIONS_QUERY_KEY,
      });
      toast.success('Versión de documento legal creada correctamente.');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'No se pudo crear la versión.'));
    },
  });
}

export interface UpdateLegalDocumentVersionVariables {
  referenceId: string;
  dto: UpdateLegalDocumentVersionDto;
}

export function useUpdateLegalDocumentVersionMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ referenceId, dto }: UpdateLegalDocumentVersionVariables) =>
      updateLegalDocumentVersion(referenceId, dto),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: LEGAL_DOCUMENT_VERSIONS_QUERY_KEY,
      });
      toast.success('Versión de documento legal actualizada correctamente.');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'No se pudo actualizar la versión.'));
    },
  });
}
