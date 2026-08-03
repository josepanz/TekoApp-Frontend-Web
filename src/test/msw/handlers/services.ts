import { http, HttpResponse } from 'msw';
import type { Service, ServicesListResponse } from '@/features/services/api';

export function buildService(overrides: Partial<Service> = {}): Service {
  return {
    id: 'a63b5212-db5e-4ef5-9614-726614174000',
    userId: 1,
    professionalId: 2,
    categoryId: 3,
    serviceTypeId: 4,
    title: 'Reparación de cañería',
    description: 'Se necesita reparar una cañería rota en el baño',
    status: 'PENDING',
    totalAmount: 125000,
    latitude: -25.2637,
    longitude: -57.5759,
    address: 'Av. España 1234, Asunción',
    images: [],
    isUrgent: false,
    createdAt: '2026-06-17T14:00:00Z',
    users: {
      id: 1,
      referenceId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
      email: 'juan@example.com',
      firstName: 'Juan',
      lastName: 'Pérez',
      phoneNumber: '+595981234567',
    },
    category: {
      id: 3,
      name: 'Plomería',
      slug: 'plomeria',
      icon: 'wrench',
      color: '#FF5733',
    },
    ...overrides,
  };
}

export const fakeServicesPage1: ServicesListResponse = {
  data: [
    buildService(),
    buildService({
      id: 'b74c6323-ec6f-5fg6-a725-837725285111',
      professionalId: undefined,
      title: 'Instalación eléctrica',
      description: 'Instalación de tablero eléctrico nuevo',
      status: 'ACCEPTED',
      totalAmount: 300000,
      users: {
        id: 5,
        referenceId: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
        email: 'maria.lopez@example.com',
        firstName: 'María',
        lastName: 'López',
      },
      category: {
        id: 6,
        name: 'Electricidad',
        slug: 'electricidad',
      },
    }),
    buildService({
      id: 'c85d7434-fd7g-6gh7-b836-948836396222',
      professionalId: 8,
      title: 'Corte de césped',
      description: 'Mantenimiento de jardín',
      status: 'COMPLETED',
      finalAmount: 80000,
      users: {
        id: 9,
        referenceId: 'c3d4e5f6-a7b8-9012-cdef-123456789012',
        email: 'pedro.gimenez@example.com',
        firstName: 'Pedro',
        lastName: 'Giménez',
      },
      category: {
        id: 10,
        name: 'Jardinería',
        slug: 'jardineria',
      },
    }),
  ],
  pagination: { total: 20, page: 1, pageSize: 10, totalPages: 2 },
};

export const servicesHandlers = [
  http.get('/api/backend/services', ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page') ?? '1');
    const status = url.searchParams.get('status');

    const data = status
      ? fakeServicesPage1.data.filter((service) => service.status === status)
      : fakeServicesPage1.data;

    return HttpResponse.json({
      data,
      pagination: { ...fakeServicesPage1.pagination, page },
    });
  }),

  http.get('/api/backend/services/:id', ({ params }) => {
    const service = fakeServicesPage1.data.find(
      (item) => item.id === params.id,
    );
    if (!service) {
      return new HttpResponse(null, { status: 404 });
    }
    return HttpResponse.json(service);
  }),
];
