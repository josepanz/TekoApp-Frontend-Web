import { http, HttpResponse } from 'msw';
import type {
  CreatePromotionRequest,
  Promotion,
  UpdatePromotionRequest,
} from '@/features/promotions/api';

export function buildPromotion(overrides: Partial<Promotion> = {}): Promotion {
  return {
    id: 'a63b5212-db5e-4ef5-9614-726614174000',
    code: 'PROMO2025',
    name: 'Descuento de verano',
    description: '20% de descuento en todos los servicios',
    type: 'PERCENTAGE',
    status: 'ACTIVE',
    discountPercentage: 20,
    minimumAmount: 30000,
    maximumDiscount: 100000,
    maxUsage: 100,
    maxUsagePerUser: 1,
    currentUsage: 42,
    validFrom: '2025-01-01T00:00:00.000Z',
    validUntil: '2025-12-31T23:59:59.000Z',
    allowedUserTypes: ['cliente', 'profesional'],
    specificUserIds: [],
    createdById: 5,
    createdAt: '2025-01-01T10:00:00.000Z',
    lastChangedAt: undefined,
    ...overrides,
  };
}

export const fakePromotions: Promotion[] = [
  buildPromotion(),
  buildPromotion({
    id: 'b74c6323-ec6f-5fg6-a725-837725285111',
    code: 'BIENVENIDA10',
    name: 'Bienvenida nuevos clientes',
    description: '10% para el primer servicio contratado',
    discountPercentage: 10,
    maximumDiscount: 50000,
    maxUsage: -1,
    currentUsage: 128,
    status: 'ACTIVE',
    validFrom: '2025-03-01T00:00:00.000Z',
    validUntil: '2026-03-01T00:00:00.000Z',
  }),
];

export const promotionsHandlers = [
  http.get('/api/backend/promotions', () => HttpResponse.json(fakePromotions)),

  http.post('/api/backend/promotions', async ({ request }) => {
    const body = (await request.json()) as CreatePromotionRequest;
    return HttpResponse.json(
      buildPromotion({
        id: 'c85d7434-fd70-6gh7-b836-948836396222',
        code: body.code,
        name: body.name,
        description: body.description,
        type: body.type,
        discountPercentage:
          body.type === 'PERCENTAGE' ? body.discountValue : undefined,
        discountAmount:
          body.type === 'FIXED_AMOUNT' ? body.discountValue : undefined,
        minimumAmount: body.minimumAmount,
        maximumDiscount: body.maximumDiscount,
        maxUsage: body.maxUsage ?? -1,
        maxUsagePerUser: body.maxUsagePerUser ?? 1,
        currentUsage: 0,
        validFrom: body.validFrom,
        validUntil: body.validUntil,
      }),
      { status: 201 },
    );
  }),

  http.put('/api/backend/promotions/:id', async ({ request, params }) => {
    const body = (await request.json()) as UpdatePromotionRequest;
    const existing = fakePromotions.find((item) => item.id === params.id);
    return HttpResponse.json(
      buildPromotion({
        ...existing,
        id: String(params.id),
        ...body,
        discountPercentage:
          body.type === 'PERCENTAGE'
            ? body.discountValue
            : existing?.discountPercentage,
        discountAmount:
          body.type === 'FIXED_AMOUNT'
            ? body.discountValue
            : existing?.discountAmount,
      }),
    );
  }),

  http.delete('/api/backend/promotions/:id', ({ params }) => {
    const existing = fakePromotions.find((item) => item.id === params.id);
    return HttpResponse.json(
      buildPromotion({
        ...existing,
        id: String(params.id),
        status: 'INACTIVE',
      }),
    );
  }),
];
