import { http, HttpResponse } from 'msw';
import { buildService } from './services';
import { fakeMyProfessionalProfile } from './professional-mode';

export const fakeActiveCategories = [
  { id: 3, name: 'Plomería', slug: 'plomeria' },
];

export const fakeServiceTypes = [{ id: 4, name: 'Instalación' }];

export const fakeClientServices = [
  buildService({ id: 'client-svc-pending', status: 'PENDING' }),
  buildService({
    id: 'client-svc-completed',
    status: 'COMPLETED',
    professional: {
      id: fakeMyProfessionalProfile.id,
      referenceId: fakeMyProfessionalProfile.referenceId,
      user: {
        id: 1,
        referenceId: 'd4e5f6a7-b8c9-0123-def4-567890123456',
        email: 'juan@example.com',
        firstName: 'Juan',
        lastName: 'Pérez',
      },
    },
  }),
];

export const fakeProfessionalsList = {
  data: [
    {
      id: 5,
      referenceId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
      userId: 1,
      categoryId: 3,
      description: 'Plomero con 10 años de experiencia',
      hourlyRate: 50000,
      skills: ['plomería'],
      certifications: [],
      yearsOfExperience: 10,
      status: 'APPROVED',
      isAvailable: true,
      isOnline: false,
      verificationStatus: 'verified',
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
      category: { id: 3, name: 'Plomería', slug: 'plomeria' },
    },
  ],
  pagination: { total: 1, page: 1, pageSize: 12, totalPages: 1 },
};

export const clientModeHandlers = [
  http.get('/api/backend/categories', () =>
    HttpResponse.json(fakeActiveCategories),
  ),
  http.get('/api/backend/service-types', () =>
    HttpResponse.json(fakeServiceTypes),
  ),
  http.post('/api/backend/services', () =>
    HttpResponse.json(buildService({ id: 'new-svc-001' }), { status: 201 }),
  ),
  http.get('/api/backend/services/my-services', () =>
    HttpResponse.json(fakeClientServices),
  ),
  http.delete(
    '/api/backend/services/:id',
    () => new HttpResponse(null, { status: 204 }),
  ),
  http.post('/api/backend/ratings', () =>
    HttpResponse.json({ id: 'rating-uuid-777' }, { status: 201 }),
  ),
  http.get('/api/backend/professionals', () =>
    HttpResponse.json(fakeProfessionalsList),
  ),
  http.get('/api/backend/professionals/reference/:referenceId', () =>
    HttpResponse.json(fakeProfessionalsList.data[0]),
  ),
];
