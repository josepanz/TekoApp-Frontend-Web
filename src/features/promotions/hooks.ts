import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  createPromotion,
  deletePromotion,
  getPromotions,
  updatePromotion,
  type CreatePromotionRequest,
  type UpdatePromotionRequest,
} from './api';

export const PROMOTIONS_QUERY_KEY = ['promotions'] as const;

export function usePromotionsQuery() {
  return useQuery({
    queryKey: PROMOTIONS_QUERY_KEY,
    queryFn: getPromotions,
  });
}

export function useCreatePromotionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: CreatePromotionRequest) => createPromotion(dto),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: PROMOTIONS_QUERY_KEY });
      toast.success('Promoción creada correctamente.');
    },
    onError: () => {
      toast.error('No se pudo crear la promoción. Intentá de nuevo.');
    },
  });
}

export function useUpdatePromotionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdatePromotionRequest }) =>
      updatePromotion(id, dto),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: PROMOTIONS_QUERY_KEY });
      toast.success('Promoción actualizada correctamente.');
    },
    onError: () => {
      toast.error('No se pudo actualizar la promoción. Intentá de nuevo.');
    },
  });
}

export function useDeletePromotionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deletePromotion(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: PROMOTIONS_QUERY_KEY });
      toast.success('Promoción desactivada correctamente.');
    },
    onError: () => {
      toast.error('No se pudo desactivar la promoción. Intentá de nuevo.');
    },
  });
}
