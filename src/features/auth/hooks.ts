import { useMutation } from '@tanstack/react-query';
import { login } from './api';
import type { LoginFormValues } from './schemas';

export function useLoginMutation() {
  return useMutation({
    mutationFn: (values: LoginFormValues) => login(values),
  });
}
