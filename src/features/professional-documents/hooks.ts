import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { toast } from 'sonner';
import { ApiError } from '@/core/api-client/errors';
import {
  getAdminProfessionalDocumentsByProfessional,
  getAdminProfessionalDocumentsQueue,
  getMyDocuments,
  getPresignedUrl,
  reviewProfessionalDocument,
  uploadMyDocument,
  type GetAdminProfessionalDocumentsParams,
  type ReviewProfessionalDocumentDto,
} from './api';

const MY_DOCUMENTS_KEY = ['professional-documents', 'me'];

function getErrorMessage(error: unknown, fallback: string): string {
  return error instanceof ApiError ? error.message : fallback;
}

export function useAdminProfessionalDocumentsQueueQuery(
  params: GetAdminProfessionalDocumentsParams,
) {
  return useQuery({
    queryKey: ['professional-documents', 'queue', params],
    queryFn: () => getAdminProfessionalDocumentsQueue(params),
    placeholderData: keepPreviousData,
  });
}

export function useProfessionalDocumentsHistoryQuery(
  professionalReferenceId: string,
) {
  return useQuery({
    queryKey: ['professional-documents', 'history', professionalReferenceId],
    queryFn: () =>
      getAdminProfessionalDocumentsByProfessional(professionalReferenceId),
  });
}

export function usePresignedUrlQuery(key: string, enabled: boolean) {
  return useQuery({
    queryKey: ['uploads', 'presigned-url', key],
    queryFn: () => getPresignedUrl(key),
    enabled,
  });
}

export interface ReviewProfessionalDocumentVariables {
  referenceId: string;
  dto: ReviewProfessionalDocumentDto;
}

export function useMyDocumentsQuery() {
  return useQuery({
    queryKey: MY_DOCUMENTS_KEY,
    queryFn: getMyDocuments,
  });
}

export interface UploadMyDocumentVariables {
  file: File;
  professionalDocumentTypeReferenceId: string;
}

export function useUploadMyDocumentMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      file,
      professionalDocumentTypeReferenceId,
    }: UploadMyDocumentVariables) =>
      uploadMyDocument(file, professionalDocumentTypeReferenceId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: MY_DOCUMENTS_KEY });
      toast.success('Documento subido correctamente.');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'No se pudo subir el documento.'));
    },
  });
}

export function useReviewProfessionalDocumentMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ referenceId, dto }: ReviewProfessionalDocumentVariables) =>
      reviewProfessionalDocument(referenceId, dto),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ['professional-documents'],
      });
      toast.success('Documento revisado correctamente.');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'No se pudo revisar el documento.'));
    },
  });
}
