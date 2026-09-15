import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { toast } from 'sonner';
import { ApiError } from '@/core/api-client/errors';
import {
  deletePortfolioItem,
  getAdminPortfolioQueue,
  getMyPortfolio,
  getPresignedUrl,
  getPublicPortfolio,
  reviewPortfolioItem,
  updatePortfolioItem,
  uploadPortfolioItem,
  type GetAdminPortfolioQueueParams,
  type ReviewPortfolioItemDto,
  type UpdatePortfolioItemDto,
} from './api';

function getErrorMessage(error: unknown, fallback: string): string {
  return error instanceof ApiError ? error.message : fallback;
}

export function useMyPortfolioQuery() {
  return useQuery({
    queryKey: ['professional-portfolio', 'me'],
    queryFn: getMyPortfolio,
  });
}

export function usePublicPortfolioQuery(professionalReferenceId: string) {
  return useQuery({
    queryKey: ['professional-portfolio', 'public', professionalReferenceId],
    queryFn: () => getPublicPortfolio(professionalReferenceId),
  });
}

export function useAdminPortfolioQueueQuery(
  params: GetAdminPortfolioQueueParams,
) {
  return useQuery({
    queryKey: ['professional-portfolio', 'queue', params],
    queryFn: () => getAdminPortfolioQueue(params),
    placeholderData: keepPreviousData,
  });
}

export function usePresignedUrlQuery(key: string) {
  return useQuery({
    queryKey: ['uploads', 'presigned-url', key],
    queryFn: () => getPresignedUrl(key),
    enabled: !!key,
  });
}

export function useUploadPortfolioItemMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ file, caption }: { file: File; caption?: string }) =>
      uploadPortfolioItem(file, caption),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ['professional-portfolio', 'me'],
      });
      toast.success('Foto subida — queda pendiente de revisión.');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'No se pudo subir la foto.'));
    },
  });
}

export function useUpdatePortfolioItemMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      referenceId,
      dto,
    }: {
      referenceId: string;
      dto: UpdatePortfolioItemDto;
    }) => updatePortfolioItem(referenceId, dto),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ['professional-portfolio', 'me'],
      });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'No se pudo actualizar la foto.'));
    },
  });
}

export function useDeletePortfolioItemMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (referenceId: string) => deletePortfolioItem(referenceId),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ['professional-portfolio', 'me'],
      });
      toast.success('Foto eliminada.');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'No se pudo eliminar la foto.'));
    },
  });
}

export function useReviewPortfolioItemMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      referenceId,
      dto,
    }: {
      referenceId: string;
      dto: ReviewPortfolioItemDto;
    }) => reviewPortfolioItem(referenceId, dto),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ['professional-portfolio'],
      });
      toast.success('Foto revisada correctamente.');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'No se pudo revisar la foto.'));
    },
  });
}
