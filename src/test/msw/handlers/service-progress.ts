import { http, HttpResponse } from 'msw';
import type { ServiceProgressEntry } from '@/features/service-progress/api';

export function buildServiceProgressEntry(
  overrides: Partial<ServiceProgressEntry> = {},
): ServiceProgressEntry {
  return {
    referenceId: 'progress-1',
    note: 'Instalé la cañería nueva',
    images: [],
    entryOrder: 1,
    createdAt: '2026-08-27T10:00:00.000Z',
    editWindowExpired: true,
    ...overrides,
  };
}

// Sin entradas por default — cada test que necesite datos los pisa con `server.use(...)`, mismo
// criterio que `servicesHandlers`.
export const serviceProgressHandlers = [
  http.get('/api/backend/services/:id/progress', () => {
    return HttpResponse.json({ data: [] });
  }),

  http.get('/api/backend/uploads/presigned-url', ({ request }) => {
    const url = new URL(request.url);
    const key = url.searchParams.get('key');
    return HttpResponse.json({ url: `https://s3.example.com/${key}` });
  }),
];
