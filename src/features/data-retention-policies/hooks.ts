import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { ApiError } from '@/core/api-client/errors';
import {
  getRetentionPolicies,
  upsertRetentionPolicy,
  type UpsertRetentionPolicyDto,
} from './api';

export const RETENTION_POLICIES_QUERY_KEY = ['data-retention-policies'];

function getErrorMessage(error: unknown, fallback: string): string {
  return error instanceof ApiError ? error.message : fallback;
}

export function useRetentionPoliciesQuery() {
  return useQuery({
    queryKey: RETENTION_POLICIES_QUERY_KEY,
    queryFn: getRetentionPolicies,
  });
}

export function useUpsertRetentionPolicyMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: UpsertRetentionPolicyDto) => upsertRetentionPolicy(dto),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: RETENTION_POLICIES_QUERY_KEY,
      });
      toast.success('Política de retención guardada correctamente.');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'No se pudo guardar la política.'));
    },
  });
}
