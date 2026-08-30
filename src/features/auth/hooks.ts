import { useMutation } from '@tanstack/react-query';
import { login, register } from './api';
import type { LoginFormValues, RegisterFormValues } from './schemas';

export function useLoginMutation() {
  return useMutation({
    mutationFn: (values: LoginFormValues) => login(values),
  });
}

export function useRegisterMutation() {
  return useMutation({
    mutationFn: (values: RegisterFormValues) => register(values),
  });
}
