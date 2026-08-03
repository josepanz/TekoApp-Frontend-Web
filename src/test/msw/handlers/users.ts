import { http, HttpResponse } from 'msw';
import type { User, UsersListResponse } from '@/features/users/api';

export function buildUser(overrides: Partial<User> = {}): User {
  return {
    id: 1,
    referenceId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    email: 'ana.gonzalez@example.com',
    status: 'ACTIVE',
    firstName: 'Ana',
    lastName: 'González',
    phoneNumber: '+595991234567',
    avatarUrl: null,
    isEmployee: false,
    isLdap: false,
    lastLogin: '2026-06-16T10:20:30Z',
    createdAt: '2026-06-17T14:00:00Z',
    ...overrides,
  };
}

export const fakeUsersPage1: UsersListResponse = {
  data: [
    buildUser(),
    buildUser({
      id: 2,
      email: 'carlos.benitez@example.com',
      firstName: 'Carlos',
      lastName: 'Benítez',
      status: 'PENDING_VERIFICATION',
    }),
  ],
  pagination: { total: 20, page: 1, pageSize: 10, totalPages: 2 },
};

export const usersHandlers = [
  http.get('/api/backend/users', ({ request }) => {
    const page = Number(new URL(request.url).searchParams.get('page') ?? '1');
    return HttpResponse.json({
      data: fakeUsersPage1.data,
      pagination: { ...fakeUsersPage1.pagination, page },
    });
  }),

  http.get('/api/backend/users/reference/:referenceId', ({ params }) => {
    return HttpResponse.json(
      buildUser({ referenceId: String(params.referenceId) }),
    );
  }),

  http.put('/api/backend/users/reference/:referenceId', async ({ request }) => {
    const body = (await request.json()) as Partial<User>;
    return HttpResponse.json(buildUser(body));
  }),
];
