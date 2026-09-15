import { http, HttpResponse } from 'msw';
import type {
  AdminPortfolioItem,
  PortfolioItem,
} from '@/features/professional-portfolio/api';

export function buildPortfolioItem(
  overrides: Partial<PortfolioItem> = {},
): PortfolioItem {
  return {
    referenceId: 'portfolio-1',
    fileKey: 'portfolio-abc123.jpg',
    caption: 'Instalación de cañerías',
    sortOrder: 0,
    isVisible: true,
    status: 'PENDING',
    reviewedAt: undefined,
    rejectionReason: undefined,
    createdAt: '2026-09-01T10:00:00.000Z',
    ...overrides,
  };
}

export function buildAdminPortfolioItem(
  overrides: Partial<AdminPortfolioItem> = {},
): AdminPortfolioItem {
  return {
    ...buildPortfolioItem(),
    professional: {
      referenceId: 'prof-1',
      firstName: 'Juan',
      lastName: 'Pérez',
    },
    ...overrides,
  };
}

export const professionalPortfolioHandlers = [
  http.get('/api/backend/professionals/me/portfolio', () => {
    return HttpResponse.json({ data: [buildPortfolioItem()] });
  }),

  http.post('/api/backend/professionals/me/portfolio', () => {
    return HttpResponse.json(buildPortfolioItem());
  }),

  http.patch(
    '/api/backend/professionals/me/portfolio/:referenceId',
    async ({ request, params }) => {
      const body = (await request.json()) as Record<string, unknown>;
      return HttpResponse.json(
        buildPortfolioItem({
          referenceId: String(params.referenceId),
          ...body,
        }),
      );
    },
  ),

  http.delete('/api/backend/professionals/me/portfolio/:referenceId', () => {
    return new HttpResponse(null, { status: 204 });
  }),

  http.get('/api/backend/professionals/:referenceId/portfolio/public', () => {
    return HttpResponse.json({
      data: [buildPortfolioItem({ status: 'APPROVED' })],
    });
  }),

  http.get('/api/backend/admin/professional-portfolio', () => {
    return HttpResponse.json({
      data: [buildAdminPortfolioItem()],
      pagination: { total: 1, page: 1, pageSize: 10, totalPages: 1 },
    });
  }),

  http.patch(
    '/api/backend/admin/professional-portfolio/:referenceId/review',
    async ({ request, params }) => {
      const body = (await request.json()) as {
        status: 'APPROVED' | 'REJECTED';
      };
      return HttpResponse.json(
        buildPortfolioItem({
          referenceId: String(params.referenceId),
          status: body.status,
        }),
      );
    },
  ),

  http.get('/api/backend/uploads/presigned-url', () => {
    return HttpResponse.json({
      url: 'https://s3.example.com/portfolio-abc123.jpg',
    });
  }),
];
