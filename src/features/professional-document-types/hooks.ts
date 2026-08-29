import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { ApiError } from '@/core/api-client/errors';
import {
  createProfessionalDocumentType,
  getProfessionalDocumentTypes,
  updateProfessionalDocumentType,
  type CreateProfessionalDocumentTypeDto,
  type UpdateProfessionalDocumentTypeDto,
} from './api';

export const PROFESSIONAL_DOCUMENT_TYPES_QUERY_KEY = [
  'professional-document-types',
];

function getErrorMessage(error: unknown, fallback: string): string {
  return error instanceof ApiError ? error.message : fallback;
}

export function useProfessionalDocumentTypesQuery() {
  return useQuery({
    queryKey: PROFESSIONAL_DOCUMENT_TYPES_QUERY_KEY,
    queryFn: getProfessionalDocumentTypes,
  });
}

export function useCreateProfessionalDocumentTypeMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateProfessionalDocumentTypeDto) =>
      createProfessionalDocumentType(dto),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: PROFESSIONAL_DOCUMENT_TYPES_QUERY_KEY,
      });
      toast.success('Tipo de documento creado correctamente.');
    },
    onError: (error) => {
      toast.error(
        getErrorMessage(error, 'No se pudo crear el tipo de documento.'),
      );
    },
  });
}

export interface UpdateProfessionalDocumentTypeVariables {
  referenceId: string;
  dto: UpdateProfessionalDocumentTypeDto;
}

export function useUpdateProfessionalDocumentTypeMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      referenceId,
      dto,
    }: UpdateProfessionalDocumentTypeVariables) =>
      updateProfessionalDocumentType(referenceId, dto),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: PROFESSIONAL_DOCUMENT_TYPES_QUERY_KEY,
      });
      toast.success('Tipo de documento actualizado correctamente.');
    },
    onError: (error) => {
      toast.error(
        getErrorMessage(error, 'No se pudo actualizar el tipo de documento.'),
      );
    },
  });
}
