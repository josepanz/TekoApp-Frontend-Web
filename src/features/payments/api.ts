import { apiFetch } from '@/core/api-client/client';
import type { components } from '@/core/api-client/types.generated';

export type Payment = components['schemas']['PaymentDetailResponseDTO'];
export type PaymentStatus = Payment['status'];
export type RefundPaymentDto = components['schemas']['RefundPaymentDto'];

export interface GetPaymentsParams {
  userId?: number;
  professionalId?: number;
  status?: PaymentStatus;
}

// GET /payments devuelve un array plano (PaymentDetailResponseDTO[]), a diferencia de /users que
// pagina con { data, pagination } — no envolver ni inventar un wrapper que el backend no manda.
export function getPayments(
  params: GetPaymentsParams = {},
): Promise<Payment[]> {
  const query = new URLSearchParams();
  if (params.userId !== undefined) {
    query.set('userId', String(params.userId));
  }
  if (params.professionalId !== undefined) {
    query.set('professionalId', String(params.professionalId));
  }
  if (params.status !== undefined) {
    query.set('status', params.status);
  }
  const queryString = query.toString();
  return apiFetch<Payment[]>(`payments${queryString ? `?${queryString}` : ''}`);
}

// POST /payments/{id}/refund exige body (RefundPaymentDto: amount + reason obligatorios).
export function refundPayment(
  id: string,
  dto: RefundPaymentDto,
): Promise<Payment> {
  return apiFetch<Payment>(`payments/${id}/refund`, {
    method: 'POST',
    body: JSON.stringify(dto),
  });
}

// POST /payments/{id}/cancel no acepta body (requestBody?: never en el Swagger generado).
export function cancelPayment(id: string): Promise<Payment> {
  return apiFetch<Payment>(`payments/${id}/cancel`, {
    method: 'POST',
  });
}

// GET /payments/{id} (PaymentController_findOne) — mismo DTO plano que /payments (sin objetos
// user/professional/service anidados, solo las FK sueltas).
export function getPaymentById(id: string): Promise<Payment> {
  return apiFetch<Payment>(`payments/${id}`);
}
