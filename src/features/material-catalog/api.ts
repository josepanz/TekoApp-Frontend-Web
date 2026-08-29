import { apiFetch } from '@/core/api-client/client';
import type { components } from '@/core/api-client/types.generated';

export type MaterialCatalogItem =
  components['schemas']['MaterialCatalogItemResponseDTO'];
export type MaterialCatalogListResponse =
  components['schemas']['MaterialCatalogListResponseDTO'];
export type MaterialQualityTier = MaterialCatalogItem['qualityTier'];
export type CreateMaterialCatalogItemDto =
  components['schemas']['CreateMaterialCatalogItemRequestDTO'];
export type UpdateMaterialCatalogItemDto =
  components['schemas']['UpdateMaterialCatalogItemRequestDTO'];

export interface GetMaterialCatalogParams {
  page: number;
  pageSize: number;
  categoryId?: number;
  countryId?: number;
  qualityTier?: MaterialQualityTier;
}

// GET /material-catalog — mismo endpoint que consume el profesional al armar un presupuesto
// (paginado server-side, ver TekoApp-Backend/openspec/specs/multi-option-quotes.md). Sin filtro
// de isActive desde acá a propósito: la tabla admin muestra todo (activos e inactivos) para poder
// reactivar un ítem.
export function getMaterialCatalog({
  page,
  pageSize,
  categoryId,
  countryId,
  qualityTier,
}: GetMaterialCatalogParams): Promise<MaterialCatalogListResponse> {
  const query = new URLSearchParams({
    page: String(page),
    pageSize: String(pageSize),
  });
  if (categoryId !== undefined) query.set('categoryId', String(categoryId));
  if (countryId !== undefined) query.set('countryId', String(countryId));
  if (qualityTier) query.set('qualityTier', qualityTier);
  return apiFetch<MaterialCatalogListResponse>(
    `material-catalog?${query.toString()}`,
  );
}

export function createMaterialCatalogItem(
  dto: CreateMaterialCatalogItemDto,
): Promise<MaterialCatalogItem> {
  return apiFetch<MaterialCatalogItem>('admin/material-catalog', {
    method: 'POST',
    body: JSON.stringify(dto),
  });
}

export function updateMaterialCatalogItem(
  referenceId: string,
  dto: UpdateMaterialCatalogItemDto,
): Promise<MaterialCatalogItem> {
  return apiFetch<MaterialCatalogItem>(
    `admin/material-catalog/${referenceId}`,
    { method: 'PATCH', body: JSON.stringify(dto) },
  );
}
