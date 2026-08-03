import { apiFetch } from '@/core/api-client/client';
import type { components } from '@/core/api-client/types.generated';

export type Rating = components['schemas']['RatingDetailResponseDTO'];

// GET /ratings (RatingsController_findAll) no está anotado con @ApiQuery en el backend — no
// acepta ningún query param (ni paginación ni filtros por isReported/type) — y la respuesta es un
// array plano `RatingDetailResponseDTO[]`, no un wrapper `{data: [...]}` (el `RatingsListResponseDTO`
// que existía antes en el Swagger del backend no coincidía con lo que el controller realmente
// devolvía — bug real de anotación, corregido en el backend 2026-08-02; ver
// `ratings.docs.ts`/`ratings.controller.ts`).
export function getRatings(): Promise<Rating[]> {
  return apiFetch<Rating[]>('ratings');
}

// DELETE /ratings/{id} (RatingsController_remove) — el id es un UUID (string), responde 204 sin
// body.
export function deleteRating(id: string): Promise<void> {
  return apiFetch<void>(`ratings/${id}`, { method: 'DELETE' });
}
