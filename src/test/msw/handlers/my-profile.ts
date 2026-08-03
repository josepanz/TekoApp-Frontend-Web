import { http, HttpResponse } from 'msw';
import type { FileInfoResponse, MeResponse } from '@/features/my-profile/api';

export function buildMeResponse(
  overrides: Partial<MeResponse> = {},
): MeResponse {
  return {
    id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    email: 'ana.gonzalez@example.com',
    firstName: 'Ana',
    lastName: 'González',
    avatarUrl: null,
    status: 'ACTIVE',
    profileStatus: 'COMPLETE',
    accessLevelId: 1,
    roles: [],
    permissions: [],
    ...overrides,
  };
}

export function buildFileInfoResponse(
  overrides: Partial<FileInfoResponse> = {},
): FileInfoResponse {
  return {
    filename: 'a1b2c3.jpg',
    originalname: 'foto.jpg',
    mimetype: 'image/jpeg',
    size: 12345,
    key: 'a1b2c3.jpg',
    url: 'https://s3.amazonaws.com/tekoapp/a1b2c3.jpg?X-Amz-Signature=fake',
    ...overrides,
  };
}

export const myProfileHandlers = [
  http.put('/api/backend/auth/me', async ({ request }) => {
    const body = (await request.json()) as Partial<MeResponse>;
    return HttpResponse.json(buildMeResponse(body));
  }),

  http.post('/api/backend/uploads/avatar', () => {
    return HttpResponse.json(buildFileInfoResponse());
  }),
];
