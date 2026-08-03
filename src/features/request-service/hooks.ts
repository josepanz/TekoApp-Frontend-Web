import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { ApiError } from '@/core/api-client/errors';
import {
  createServiceRequest,
  getActiveCategories,
  getServiceTypes,
} from './api';

export function useActiveCategoriesQuery() {
  return useQuery({
    queryKey: ['categories', 'active'],
    queryFn: getActiveCategories,
  });
}

export function useServiceTypesQuery() {
  return useQuery({
    queryKey: ['service-types'],
    queryFn: getServiceTypes,
  });
}

export function useCreateServiceRequestMutation() {
  return useMutation({
    mutationFn: createServiceRequest,
    onSuccess: () => {
      toast.success(
        'Solicitud enviada. Te avisaremos cuando un profesional la acepte.',
      );
    },
    onError: (error) => {
      toast.error(
        error instanceof ApiError
          ? error.message
          : 'No se pudo enviar la solicitud. Intentá de nuevo.',
      );
    },
  });
}
