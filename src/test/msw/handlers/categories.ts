import { http, HttpResponse } from 'msw';
import type { Category, CategoryStats } from '@/features/categories/api';

export function buildCategory(overrides: Partial<Category> = {}): Category {
  return {
    id: 1,
    referenceId: 'cat-ref-001',
    name: 'Plomería',
    slug: 'plomeria',
    description: 'Servicios de reparación e instalaciones sanitarias',
    icon: 'wrench-outline',
    color: '#2ecc71',
    sortOrder: 0,
    status: 'ACTIVE',
    isVisible: true,
    requiresVerification: false,
    metadata: null,
    parentCategoryId: null,
    createdAt: '2026-05-01T10:00:00Z',
    lastChangedAt: null,
    ...overrides,
  };
}

export const fakeCategories: Category[] = [
  buildCategory(),
  buildCategory({
    id: 2,
    name: 'Electricidad',
    slug: 'electricidad',
    description: 'Instalaciones y reparaciones eléctricas',
    icon: 'flash-outline',
    color: '#f1c40f',
    sortOrder: 1,
    requiresVerification: true,
  }),
  buildCategory({
    id: 3,
    name: 'Jardinería',
    slug: 'jardineria',
    description: 'Mantenimiento de jardines y espacios verdes',
    icon: 'leaf-outline',
    color: '#27ae60',
    sortOrder: 2,
    status: 'INACTIVE',
    isVisible: false,
  }),
];

export function buildCategoryStats(
  overrides: Partial<CategoryStats> = {},
): CategoryStats {
  return {
    professionalCount: 12,
    serviceCount: 34,
    averageRating: 4.5,
    totalServices: 34,
    ...overrides,
  };
}

export const categoriesHandlers = [
  http.get('/api/backend/categories/all', () =>
    HttpResponse.json(fakeCategories),
  ),

  http.get('/api/backend/categories/:id/stats', ({ params }) => {
    const existing = fakeCategories.find(
      (category) => category.id === Number(params.id),
    );
    if (!existing) {
      return new HttpResponse(null, { status: 404 });
    }
    return HttpResponse.json(buildCategoryStats());
  }),

  http.get('/api/backend/categories/:id', ({ params }) => {
    const existing = fakeCategories.find(
      (category) => category.id === Number(params.id),
    );
    if (!existing) {
      return new HttpResponse(null, { status: 404 });
    }
    return HttpResponse.json(existing);
  }),

  http.post('/api/backend/categories', async ({ request }) => {
    const body = (await request.json()) as Partial<Category>;
    return HttpResponse.json(
      buildCategory({
        id: 99,
        sortOrder: 0,
        status: 'ACTIVE',
        isVisible: true,
        requiresVerification: false,
        ...body,
      }),
      { status: 201 },
    );
  }),

  http.patch('/api/backend/categories/:id', async ({ params, request }) => {
    const body = (await request.json()) as Partial<Category>;
    const existing =
      fakeCategories.find((category) => category.id === Number(params.id)) ??
      buildCategory();
    return HttpResponse.json({ ...existing, ...body });
  }),

  http.delete('/api/backend/categories/:id', () => {
    return new HttpResponse(null, { status: 204 });
  }),

  http.patch('/api/backend/categories/:id/toggle-visibility', ({ params }) => {
    const existing =
      fakeCategories.find((category) => category.id === Number(params.id)) ??
      buildCategory();
    return HttpResponse.json({
      ...existing,
      isVisible: !existing.isVisible,
    });
  }),
];
