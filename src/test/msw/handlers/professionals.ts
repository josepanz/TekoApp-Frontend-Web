import { http, HttpResponse } from 'msw';
import type {
  Professional,
  ProfessionalsListResponse,
  VerifyProfessionalRequest,
} from '@/features/professionals/api';

export function buildProfessional(
  overrides: Partial<Professional> = {},
): Professional {
  return {
    id: 1,
    referenceId: 'p1a2b3c4-d5e6-7890-abcd-ef1234567890',
    userId: 10,
    categoryId: 2,
    description: 'Plomero con 10 años de experiencia',
    hourlyRate: 50000,
    fixedRate: 200000,
    skills: ['plomería', 'gasfitería'],
    certifications: ['Certificado SENAI'],
    yearsOfExperience: 10,
    status: 'APPROVED',
    isAvailable: true,
    isOnline: false,
    verificationStatus: 'verified',
    totalServices: 42,
    averageRating: 4.8,
    totalRatings: 35,
    createdAt: '2026-06-17T14:00:00Z',
    user: {
      id: 10,
      email: 'juan.perez@example.com',
      firstName: 'Juan',
      lastName: 'Pérez',
      phoneNumber: '+595981234567',
    },
    category: {
      id: 2,
      name: 'Plomería',
      slug: 'plomeria',
      icon: 'wrench',
      color: '#FF5733',
    },
    ...overrides,
  };
}

export const fakeProfessionalsPage1: ProfessionalsListResponse = {
  data: [
    buildProfessional(),
    buildProfessional({
      id: 2,
      referenceId: 'p2b3c4d5-e6f7-8901-bcde-f21345678901',
      userId: 11,
      categoryId: 3,
      description: 'Electricista certificado',
      status: 'PENDING',
      verificationStatus: 'pending',
      isAvailable: false,
      averageRating: 4.2,
      totalRatings: 12,
      totalServices: 8,
      user: {
        id: 11,
        email: 'maria.lopez@example.com',
        firstName: 'María',
        lastName: 'López',
        phoneNumber: '+595991234567',
      },
      category: {
        id: 3,
        name: 'Electricidad',
        slug: 'electricidad',
        icon: 'zap',
        color: '#3357FF',
      },
    }),
  ],
  pagination: { total: 20, page: 1, pageSize: 10, totalPages: 2 },
};

export const professionalsHandlers = [
  http.get('/api/backend/professionals', ({ request }) => {
    const page = Number(new URL(request.url).searchParams.get('page') ?? '1');
    return HttpResponse.json({
      data: fakeProfessionalsPage1.data,
      pagination: { ...fakeProfessionalsPage1.pagination, page },
    });
  }),

  http.post(
    '/api/backend/professionals/:id/verify',
    async ({ request, params }) => {
      const body = (await request.json()) as VerifyProfessionalRequest;
      const professional = fakeProfessionalsPage1.data.find(
        (item) => String(item.id) === params.id,
      );
      return HttpResponse.json(
        buildProfessional({
          ...professional,
          verificationStatus: body.isVerified ? 'verified' : 'rejected',
          status: body.isVerified ? 'APPROVED' : 'REJECTED',
        }),
      );
    },
  ),

  http.post('/api/backend/professionals/:id/suspend', ({ params }) => {
    const professional = fakeProfessionalsPage1.data.find(
      (item) => String(item.id) === params.id,
    );
    return HttpResponse.json(
      buildProfessional({ ...professional, status: 'SUSPENDED' }),
    );
  }),
];
