import { http, HttpResponse } from 'msw';
import type { Rating } from '@/features/ratings/api';

export function buildRating(overrides: Partial<Rating> = {}): Rating {
  return {
    id: 1,
    referenceId: 'a63b5212-db5e-4ef5-9614-726614174000',
    userId: 1,
    professionalId: 10,
    serviceId: 'b72c6323-ec6f-5fa6-a725-837725285111',
    type: 'CLIENT_TO_PROFESSIONAL',
    rating: 4.5,
    review: 'Excelente trabajo, muy profesional y puntual.',
    criteria: null,
    isAnonymous: false,
    isReported: false,
    reportReason: null,
    isActive: true,
    createdAt: '2026-06-17T14:00:00Z',
    createdBy: null,
    ...overrides,
  };
}

// GET /ratings devuelve un array plano — nunca envolver en `{data: [...]}` acá (ver el comentario
// en `features/ratings/api.ts`: un `RatingsListResponseDTO` con ese wrapper existió en el Swagger
// del backend pero nunca coincidió con la respuesta real, y este mock replicaba el mismo error,
// dejando el bug invisible en los tests unitarios).
export const fakeRatings: Rating[] = [
  buildRating(),
  buildRating({
    id: 2,
    referenceId: 'b1c2d3e4-f5a6-7890-abcd-ef1234567891',
    userId: 2,
    professionalId: 20,
    type: 'PROFESSIONAL_TO_CLIENT',
    rating: 2,
    review:
      'El cliente fue grosero y no respetó el horario acordado, tuve que esperar más de una hora sin ninguna explicación previa.',
    isReported: true,
    reportReason: 'Lenguaje ofensivo',
  }),
  buildRating({
    id: 3,
    referenceId: 'c1d2e3f4-a5b6-7890-abcd-ef1234567892',
    userId: 3,
    professionalId: 30,
    type: 'CLIENT_TO_PROFESSIONAL',
    rating: 5,
    review: null,
  }),
];

export const ratingsHandlers = [
  http.get('/api/backend/ratings', () => {
    return HttpResponse.json(fakeRatings);
  }),
  http.delete('/api/backend/ratings/:id', () => {
    return new HttpResponse(null, { status: 204 });
  }),
];
