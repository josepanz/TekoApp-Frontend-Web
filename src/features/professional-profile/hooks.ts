import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { ApiError } from '@/core/api-client/errors';
import {
  getMyProfessionalProfile,
  updateMyAvailability,
  updateMyProfessionalProfile,
  type UpdateAvailabilityRequest,
  type UpdateProfessionalProfileRequest,
} from './api';

export const MY_PROFESSIONAL_PROFILE_KEY = ['professionals', 'me'];

export function useMyProfessionalProfileQuery() {
  return useQuery({
    queryKey: MY_PROFESSIONAL_PROFILE_KEY,
    queryFn: getMyProfessionalProfile,
    retry: false,
  });
}

function handleMutationError(error: unknown) {
  toast.error(
    error instanceof ApiError
      ? error.message
      : 'Ocurrió un error inesperado. Intentá de nuevo.',
  );
}

export function useUpdateMyProfessionalProfileMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      referenceId,
      dto,
    }: {
      referenceId: string;
      dto: UpdateProfessionalProfileRequest;
    }) => updateMyProfessionalProfile(referenceId, dto),
    onSuccess: () => {
      toast.success('Perfil actualizado correctamente');
      void queryClient.invalidateQueries({
        queryKey: MY_PROFESSIONAL_PROFILE_KEY,
      });
    },
    onError: handleMutationError,
  });
}

export function useUpdateMyAvailabilityMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: UpdateAvailabilityRequest }) =>
      updateMyAvailability(id, dto),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: MY_PROFESSIONAL_PROFILE_KEY,
      });
    },
    onError: handleMutationError,
  });
}
