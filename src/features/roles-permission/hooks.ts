import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { ApiError } from '@/core/api-client/errors';
import {
  createRole,
  getRoles,
  updateRole,
  type CreateRoleRequest,
  type UpdateRoleRequest,
} from './api';

const ROLES_QUERY_KEY = 'roles';

function getErrorMessage(error: unknown, fallback: string): string {
  return error instanceof ApiError ? error.message : fallback;
}

export function useRolesQuery() {
  return useQuery({
    queryKey: [ROLES_QUERY_KEY],
    queryFn: () => getRoles(),
  });
}

export function useCreateRoleMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: CreateRoleRequest) => createRole(dto),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [ROLES_QUERY_KEY] });
      toast.success('El rol se creó correctamente.');
    },
    onError: (error) => {
      toast.error(
        getErrorMessage(error, 'No se pudo crear el rol. Intentá de nuevo.'),
      );
    },
  });
}

export function useUpdateRoleMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: UpdateRoleRequest }) =>
      updateRole(id, dto),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [ROLES_QUERY_KEY] });
      toast.success('El rol se actualizó correctamente.');
    },
    onError: (error) => {
      toast.error(
        getErrorMessage(
          error,
          'No se pudo actualizar el rol. Intentá de nuevo.',
        ),
      );
    },
  });
}
