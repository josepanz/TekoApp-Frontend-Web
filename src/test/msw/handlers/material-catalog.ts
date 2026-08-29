import { http, HttpResponse } from 'msw';
import type { MaterialCatalogItem } from '@/features/material-catalog/api';

export function buildMaterialCatalogItem(
  overrides: Partial<MaterialCatalogItem> = {},
): MaterialCatalogItem {
  return {
    referenceId: 'item-1',
    categoryId: 1,
    countryId: undefined,
    name: 'Cerámica esmaltada 30x30',
    unit: 'm2',
    qualityTier: 'STANDARD',
    defaultPrice: 45000,
    isActive: true,
    ...overrides,
  };
}

export const materialCatalogHandlers = [
  http.get('/api/backend/material-catalog', () => {
    return HttpResponse.json({
      data: [buildMaterialCatalogItem()],
      pagination: { total: 1, page: 1, pageSize: 10, totalPages: 1 },
    });
  }),

  http.post('/api/backend/admin/material-catalog', async ({ request }) => {
    const body = (await request.json()) as Partial<MaterialCatalogItem>;
    return HttpResponse.json(
      buildMaterialCatalogItem({ referenceId: 'item-new', ...body }),
    );
  }),

  http.patch(
    '/api/backend/admin/material-catalog/:referenceId',
    async ({ request, params }) => {
      const body = (await request.json()) as Partial<MaterialCatalogItem>;
      return HttpResponse.json(
        buildMaterialCatalogItem({
          referenceId: String(params.referenceId),
          ...body,
        }),
      );
    },
  ),
];
