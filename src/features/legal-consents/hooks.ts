import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ApiError } from '@/core/api-client/errors';
import {
  acceptConsent,
  getPendingConsents,
  type ConsentDocumentType,
} from './api';

const PENDING_KEY = ['legal-consents', 'pending'];

export function usePendingConsentsQuery(enabled: boolean) {
  return useQuery({
    queryKey: PENDING_KEY,
    queryFn: getPendingConsents,
    enabled,
    // Siempre fresco: si el usuario ya aceptó en otra pestaña no debe verse como pendiente.
    staleTime: 0,
  });
}

/** Acepta todas las versiones pendientes del tipo indicado (normalmente una sola). */
export function useAcceptConsentsMutation(documentType: ConsentDocumentType) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const pending = await getPendingConsents();
      const targets = pending.filter((v) => v.documentType === documentType);
      for (const version of targets) {
        await acceptConsent(version.referenceId);
      }
      return targets.length;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: PENDING_KEY });
    },
  });
}

export function consentErrorMessage(error: unknown, fallback: string): string {
  return error instanceof ApiError ? error.message : fallback;
}
