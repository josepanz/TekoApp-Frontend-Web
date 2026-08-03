import { apiFetch } from '@/core/api-client/client';
import type { components } from '@/core/api-client/types.generated';

export type Category = components['schemas']['CategoryDetailResponseDTO'];
export type CategoryStats = components['schemas']['CategoryStatsResponseDTO'];
export type CreateCategoryDto = components['schemas']['CreateCategoryDto'];
export type UpdateCategoryDto = components['schemas']['UpdateCategoryDto'];

// GET /categories (CategoriesController_findAll) está documentado como "Retorna todas las
// categorías activas y visibles" — es decir, oculta categorías inactivas o no visibles, lo cual
// lo vuelve inútil para un panel admin (necesitamos poder ver y reactivar/mostrar justamente esas
// categorías). GET /categories/all (CategoriesController_findAllWithRelations) está documentado
// explícitamente como "para panel de administración" y devuelve el listado completo sin filtrar
// por estado/visibilidad — por eso es el que usamos acá pese a no ser la ruta obvia por nombre.
// Pese al nombre ("WithRelations") y a la descripción ("árbol completo"), el tipo de respuesta
// generado sigue siendo un array plano de CategoryDetailResponseDTO (no paginado, no anidado).
export function getCategories(): Promise<Category[]> {
  return apiFetch<Category[]>('categories/all');
}

// GET /categories/:id (CategoriesController_findOne) — sin guard, devuelve el detalle completo de
// una categoría por su ID numérico. A diferencia de professionals, el Swagger no expone acá una
// ruta pública por referenceId — el detalle admin se busca por `id`.
export function getCategoryById(id: number): Promise<Category> {
  return apiFetch<Category>(`categories/${id}`);
}

// GET /categories/:id/stats (CategoriesController_getCategoryStats) — cantidad de profesionales/
// servicios vinculados a la categoría. Se usa para enriquecer la página de detalle con uso real
// en vez de un volcado plano de los campos del DTO.
export function getCategoryStats(id: number): Promise<CategoryStats> {
  return apiFetch<CategoryStats>(`categories/${id}/stats`);
}

export function createCategory(dto: CreateCategoryDto): Promise<Category> {
  return apiFetch<Category>('categories', {
    method: 'POST',
    body: JSON.stringify(dto),
  });
}

export function updateCategory(
  id: number,
  dto: UpdateCategoryDto,
): Promise<Category> {
  return apiFetch<Category>(`categories/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(dto),
  });
}

export function deleteCategory(id: number): Promise<void> {
  return apiFetch<void>(`categories/${id}`, { method: 'DELETE' });
}

// PATCH, no POST — el Swagger documenta esta ruta con verbo PATCH (CategoriesController_toggleVisibility)
// pese a que el nombre del endpoint sugiere una acción tipo POST. No requiere body.
export function toggleCategoryVisibility(id: number): Promise<Category> {
  return apiFetch<Category>(`categories/${id}/toggle-visibility`, {
    method: 'PATCH',
  });
}
