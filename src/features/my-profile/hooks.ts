import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { ApiError } from '@/core/api-client/errors';
import { updateMe, uploadAvatar, type UpdateMeDto } from './api';

function getErrorMessage(error: unknown, fallback: string): string {
  return error instanceof ApiError ? error.message : fallback;
}

export function useUpdateMeMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: UpdateMeDto) => updateMe(dto),
    onSuccess: () => {
      // La sesión (avatar/nombre en el Topbar) se lee de GET /auth/scope — invalidar para que
      // el próximo render la vuelva a pedir en vez de mostrar datos viejos.
      void queryClient.invalidateQueries({ queryKey: ['auth', 'scope'] });
      toast.success('Perfil actualizado correctamente.');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'No se pudo actualizar el perfil.'));
    },
  });
}

export function useUploadAvatarMutation() {
  return useMutation({
    mutationFn: (file: File) => uploadAvatar(file),
    onError: (error) => {
      toast.error(getErrorMessage(error, 'No se pudo subir la imagen.'));
    },
  });
}
