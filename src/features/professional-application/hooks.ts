import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { ApiError } from '@/core/api-client/errors';
import { MY_PROFESSIONAL_PROFILE_KEY } from '@/features/professional-profile/hooks';
import {
  applyAsProfessional,
  getActiveCategories,
  type CreateProfessionalRequest,
} from './api';

export function useActiveCategoriesQuery() {
  return useQuery({
    queryKey: ['categories', 'active'],
    queryFn: getActiveCategories,
  });
}

export function useApplyAsProfessionalMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateProfessionalRequest) => applyAsProfessional(dto),
    onSuccess: () => {
      // Invalida la query compartida con ModeSwitcher/ProModeLink/ProfessionalGate — sin esto el
      // usuario vería el estado viejo (sin perfil) hasta recargar la página a mano.
      void queryClient.invalidateQueries({
        queryKey: MY_PROFESSIONAL_PROFILE_KEY,
      });
    },
    onError: (error) => {
      toast.error(
        error instanceof ApiError
          ? error.message
          : 'Ocurrió un error inesperado. Intentá de nuevo.',
      );
    },
  });
}
