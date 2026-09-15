import { useMutation } from '@tanstack/react-query';
import { cancelAccountDeletion, requestAccountDeletion } from './api';

export function useRequestAccountDeletionMutation() {
  return useMutation({
    mutationFn: requestAccountDeletion,
  });
}

export function useCancelAccountDeletionMutation() {
  return useMutation({
    mutationFn: cancelAccountDeletion,
  });
}
