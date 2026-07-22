import { http, HttpResponse } from 'msw';
import type { Payment } from '@/features/payments/api';

export function buildPayment(overrides: Partial<Payment> = {}): Payment {
  return {
    id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    userId: 1,
    professionalId: 5,
    serviceRequestId: 'req-uuid-123',
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
    id: '2b1c1e2a-58cc-4372-a567-0e02b2c3d001',
    userId: 2,
    professionalId: 6,
    transactionId: 'txn-uuid-pending',
    status: 'PENDING',
    totalAmount: 55000,
    createdAt: '2026-06-18T09:30:00Z',
  }),
  buildPayment({
    id: '9d3f4a5b-58cc-4372-a567-0e02b2c3d002',
    userId: 3,
    professionalId: 7,
    transactionId: 'txn-uuid-cancelled',
    status: 'CANCELLED',
    totalAmount: 98000,
    createdAt: '2026-06-19T11:15:00Z',
  }),
];

export const paymentsHandlers = [
  http.get('/api/backend/payments', ({ request }) => {
    const status = new URL(request.url).searchParams.get('status');
    const data = status
      ? fakePayments.filter((payment) => payment.status === status)
      : fakePayments;
    return HttpResponse.json(data);
  }),

  http.post('/api/backend/payments/:id/refund', ({ params }) => {
    const payment = fakePayments.find((item) => item.id === params.id);
    if (!payment) {
      return HttpResponse.json(
        { message: 'Pago no encontrado' },
        { status: 404 },
      );
    }
    return HttpResponse.json({ ...payment, status: 'REFUNDED' });
  }),

  http.post('/api/backend/payments/:id/cancel', ({ params }) => {
    const payment = fakePayments.find((item) => item.id === params.id);
    if (!payment) {
      return HttpResponse.json(
        { message: 'Pago no encontrado' },
        { status: 404 },
      );
    }
    return HttpResponse.json({ ...payment, status: 'CANCELLED' });
  }),
];
