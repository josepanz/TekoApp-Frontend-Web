import { apiFetch } from '@/core/api-client/client';
import type { components } from '@/core/api-client/types.generated';

export type Payment = components['schemas']['PaymentDetailResponseDTO'];
export type PaymentStatus = Payment['status'];
export type RefundPaymentDto = components['schemas']['RefundPaymentDto'];
export type Tip = components['schemas']['TipResponseDTO'];
export type TipMode = Tip['mode'];
export type TipConfig = components['schemas']['TipConfigResponseDTO'];

export interface CreateTipDto {
  mode: TipMode;
  percentage?: number;
  amount?: number;
}

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
// user/professional/service anidados, solo las FK sueltas). El backend valida que el pago sea
// del usuario autenticado (o que tenga payments.audit:read/admin:all) — ver
// `getPaymentByIdForViewer` en TekoApp-Backend.
export function getPaymentById(id: string): Promise<Payment> {
  return apiFetch<Payment>(`payments/${id}`);
}

// GET /payments/me — pagos propios del usuario autenticado, resuelto server-side desde el token
// (nunca un userId de query param) — es lo que consume el modo cliente de este portal.
export function getMyPayments(): Promise<Payment[]> {
  return apiFetch<Payment[]>('payments/me');
}

export function getTipConfig(): Promise<TipConfig> {
  return apiFetch<TipConfig>('tips/config');
}

export function createTip(paymentId: string, dto: CreateTipDto): Promise<Tip> {
  return apiFetch<Tip>(`payments/${paymentId}/tip`, {
    method: 'POST',
    body: JSON.stringify(dto),
  });
}
