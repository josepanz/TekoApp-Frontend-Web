import { http, HttpResponse } from 'msw';
import type { Payment, TipConfig } from '@/features/payments/api';

export function buildPayment(overrides: Partial<Payment> = {}): Payment {
  return {
    id: 1,
    referenceId: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    userId: 1,
    professionalId: 5,
    serviceId: 'req-uuid-123',
    amount: 150000,
    currencyCode: 'PYG',
    fee: 4350,
    tax: 32262,
    totalAmount: 186612,
    status: 'PAID',
    paymentMethod: 'CREDIT_CARD',
    paymentProvider: 'STRIPE',
    transactionId: 'txn-uuid-abc',
    isRecurring: false,
    platformFee: 0,
    createdAt: '2026-06-17T14:00:00Z',
    ...overrides,
  };
}

export const fakePayments: Payment[] = [
  buildPayment(),
  buildPayment({
    id: 2,
    referenceId: '2b1c1e2a-58cc-4372-a567-0e02b2c3d001',
    userId: 2,
    professionalId: 6,
    transactionId: 'txn-uuid-pending',
    status: 'PENDING',
    totalAmount: 55000,
    createdAt: '2026-06-18T09:30:00Z',
  }),
  buildPayment({
    id: 3,
    referenceId: '9d3f4a5b-58cc-4372-a567-0e02b2c3d002',
    userId: 3,
    professionalId: 7,
    transactionId: 'txn-uuid-cancelled',
    status: 'CANCELLED',
    totalAmount: 98000,
    createdAt: '2026-06-19T11:15:00Z',
  }),
];

export function buildTipConfig(overrides: Partial<TipConfig> = {}): TipConfig {
  return {
    isEnabled: true,
    isMandatory: false,
    suggestedPercentages: [10, 15, 20],
    allowFreeAmount: true,
    ...overrides,
  };
}

// `userId: 1` es el mismo "usuario de test" por defecto que `buildPayment()` — no hay un id de
// sesión fijo real en estos mocks (el JWT real nunca expone el id interno), así que se elige el
// mismo valor que ya usan los fixtures de pagos para simular "mis pagos".
export const fakeTipConfig: TipConfig = buildTipConfig();

export const paymentsHandlers = [
  // `me` DEBE ir antes de `:id` (más abajo) — mismo motivo que en el backend real.
  http.get('/api/backend/payments/me', () => {
    return HttpResponse.json(
      fakePayments.filter((payment) => payment.userId === 1),
    );
  }),

  http.get('/api/backend/tips/config', () => {
    return HttpResponse.json(fakeTipConfig);
  }),

  http.post('/api/backend/payments/:id/tip', async ({ params, request }) => {
    const payment = fakePayments.find((item) => item.referenceId === params.id);
    if (!payment) {
      return HttpResponse.json(
        { message: 'Pago no encontrado' },
        { status: 404 },
      );
    }
    const body = (await request.json()) as {
      mode: 'PERCENTAGE' | 'FIXED' | 'FREE';
      percentage?: number;
      amount?: number;
    };
    const amount =
      body.mode === 'PERCENTAGE'
        ? Math.round((payment.totalAmount * (body.percentage ?? 0)) / 100)
        : (body.amount ?? 0);
    return HttpResponse.json({
      referenceId: 'tip-uuid-0001',
      mode: body.mode,
      percentage: body.mode === 'PERCENTAGE' ? body.percentage : null,
      amount,
      currencyCode: payment.currencyCode,
      createdAt: '2026-08-28T12:00:00Z',
    });
  }),

  http.get('/api/backend/payments', ({ request }) => {
    const status = new URL(request.url).searchParams.get('status');
    const data = status
      ? fakePayments.filter((payment) => payment.status === status)
      : fakePayments;
    return HttpResponse.json(data);
  }),

  http.post('/api/backend/payments/:id/refund', ({ params }) => {
    const payment = fakePayments.find((item) => item.referenceId === params.id);
    if (!payment) {
      return HttpResponse.json(
        { message: 'Pago no encontrado' },
        { status: 404 },
      );
    }
    return HttpResponse.json({ ...payment, status: 'REFUNDED' });
  }),

  http.post('/api/backend/payments/:id/cancel', ({ params }) => {
    const payment = fakePayments.find((item) => item.referenceId === params.id);
    if (!payment) {
      return HttpResponse.json(
        { message: 'Pago no encontrado' },
        { status: 404 },
      );
    }
    return HttpResponse.json({ ...payment, status: 'CANCELLED' });
  }),

  http.get('/api/backend/payments/:id', ({ params }) => {
    const payment = fakePayments.find((item) => item.referenceId === params.id);
    if (!payment) {
      return new HttpResponse(null, { status: 404 });
    }
    return HttpResponse.json(payment);
  }),
];
