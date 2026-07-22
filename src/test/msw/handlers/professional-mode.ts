import { http, HttpResponse } from 'msw';
import type { Professional } from '@/features/professional-profile/api';
import { buildService } from './services';

export const fakeMyProfessionalProfile: Professional = {
  id: 5,
  referenceId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  userId: 1,
  categoryId: 3,
  description: 'Plomero con 10 años de experiencia',
  hourlyRate: 50000,
  fixedRate: undefined,
  skills: ['plomería', 'gasfitería'],
  certifications: [],
  yearsOfExperience: 10,
  status: 'APPROVED',
  isAvailable: true,
  isOnline: false,
  verificationStatus: 'verified',
  currentLatitude: undefined,
  currentLongitude: undefined,
  lastLocationUpdate: undefined,
  totalServices: 42,
  averageRating: 4.8,
  totalRatings: 35,
  createdAt: '2026-01-01T00:00:00Z',
  user: {
    id: 1,
    email: 'juan@example.com',
    firstName: 'Juan',
    lastName: 'Pérez',
  },
  category: {
    id: 3,
    name: 'Plomería',
    slug: 'plomeria',
  },
};

export const fakePendingService = buildService({
  id: 'pending-svc-001',
  status: 'PENDING',
  professionalId: undefined,
});

export const fakeMyServices = [
  buildService({ id: 'accepted-svc-001', status: 'ACCEPTED' }),
  buildService({ id: 'inprogress-svc-001', status: 'IN_PROGRESS' }),
  buildService({ id: 'completed-svc-001', status: 'COMPLETED' }),
];

export const professionalModeHandlers = [
  http.get('/api/backend/professionals/me', () =>
    HttpResponse.json(fakeMyProfessionalProfile),
  ),
  http.get('/api/backend/services', () =>
    HttpResponse.json({
      data: [fakePendingService],
      pagination: { total: 1, page: 1, pageSize: 10, totalPages: 1 },
    }),
  ),
  http.post('/api/backend/services/:id/accept', ({ params }) =>
    HttpResponse.json(
      buildService({ id: String(params.id), status: 'ACCEPTED' }),
    ),
  ),
  http.get('/api/backend/services/my-services', () =>
    HttpResponse.json(fakeMyServices),
  ),
  http.post('/api/backend/services/:id/start', ({ params }) =>
    HttpResponse.json(
      buildService({ id: String(params.id), status: 'IN_PROGRESS' }),
    ),
  ),
  http.post('/api/backend/services/:id/complete', ({ params }) =>
    HttpResponse.json(
      buildService({ id: String(params.id), status: 'COMPLETED' }),
    ),
  ),
  http.get('/api/backend/professionals/:id/reviews', () =>
    HttpResponse.json({
      data: [],
      pagination: { total: 0, page: 1, pageSize: 10, totalPages: 1 },
    }),
  ),
  http.post('/api/backend/ratings/professional-to-client', () =>
    HttpResponse.json({ id: 'rating-uuid-999' }, { status: 201 }),
  ),
];
