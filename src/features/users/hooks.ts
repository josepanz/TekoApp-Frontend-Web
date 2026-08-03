import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { toast } from 'sonner';
import { ApiError } from '@/core/api-client/errors';
import {
  getUserByReference,
  getUsers,
  updateUserByReference,
  type GetUsersParams,
  type UpdateUserDto,
} from './api';

function getErrorMessage(error: unknown, fallback: string): string {
  return error instanceof ApiError ? error.message : fallback;
}

export function useUsersQuery(params: GetUsersParams) {
  return useQuery({
    queryKey: ['users', params],
    queryFn: () => getUsers(params),
    placeholderData: keepPreviousData,
  });
}

export function useUserDetailQuery(referenceId: string | undefined) {
  return useQuery({
    queryKey: ['users', 'detail', referenceId],
    queryFn: () => getUserByReference(referenceId!),
    enabled: !!referenceId,
  });
}

export function useUpdateUserMutation(referenceId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: UpdateUserDto) => updateUserByReference(referenceId, dto),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('Usuario actualizado correctamente.');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'No se pudo actualizar el usuario.'));
    },
  });
}
