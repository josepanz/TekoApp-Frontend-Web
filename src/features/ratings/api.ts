import { apiFetch } from '@/core/api-client/client';
import type { components } from '@/core/api-client/types.generated';

export type RatingsListResponse =
  components['schemas']['RatingsListResponseDTO'];
export type Rating = components['schemas']['RatingDetailResponseDTO'];

// GET /ratings (RatingsController_findAll) no está anotado con @ApiQuery en el backend — no
// acepta ningún query param (ni paginación ni filtros por isReported/type) — y la respuesta no
// está paginada: `RatingsListResponseDTO` solo trae `data`, a diferencia de `UsersListResponseDTO`.
// Confirmado leyendo types.generated.ts (operations.RatingsController_findAll). Ver
// documentation/architecture.md.
export function getRatings(): Promise<RatingsListResponse> {
  return apiFetch<RatingsListResponse>('ratings');
}

// DELETE /ratings/{id} (RatingsController_remove) — el id es un UUID (string), responde 204 sin
// body.
export function deleteRating(id: string): Promise<void> {
  return apiFetch<void>(`ratings/${id}`, { method: 'DELETE' });
}
