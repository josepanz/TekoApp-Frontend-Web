import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  cancelPayment,
  getPaymentById,
  getPayments,
  refundPayment,
  type GetPaymentsParams,
  type RefundPaymentDto,
} from './api';
import { ApiError } from '@/core/api-client/errors';

const PAYMENTS_QUERY_KEY = 'payments';

function getErrorMessage(error: unknown, fallback: string): string {
  return error instanceof ApiError ? error.message : fallback;
}

export function usePaymentsQuery(params: GetPaymentsParams = {}) {
  return useQuery({
    queryKey: [PAYMENTS_QUERY_KEY, params],
    queryFn: () => getPayments(params),
  });
}

export function usePaymentDetailQuery(id: string) {
  return useQuery({
    queryKey: [PAYMENTS_QUERY_KEY, 'detail', id],
    queryFn: () => getPaymentById(id),
  });
}

export function useRefundPaymentMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: RefundPaymentDto }) =>
      refundPayment(id, dto),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [PAYMENTS_QUERY_KEY] });
      toast.success('El pago se reembolsó correctamente.');
    },
    onError: (error) => {
      toast.error(
        getErrorMessage(
          error,
          'No se pudo reembolsar el pago. Intentá de nuevo.',
        ),
      );
    },
  });
}

export function useCancelPaymentMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => cancelPayment(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [PAYMENTS_QUERY_KEY] });
      toast.success('El pago se canceló correctamente.');
    },
    onError: (error) => {
      toast.error(
        getErrorMessage(
          error,
          'No se pudo cancelar el pago. Intentá de nuevo.',
        ),
      );
    },
  });
}
