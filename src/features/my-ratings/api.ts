import { apiFetch } from '@/core/api-client/client';
import type { components } from '@/core/api-client/types.generated';

export type UserRatingStats =
  components['schemas']['UserRatingStatsResponseDTO'];

// Resuelve el userId desde el token en el backend (ver `RatingsController_getMyRatingStats`) —
// el cliente nunca conoce su propio id interno, `GET /auth/scope` no lo expone (ver
// `openspec/decisions.md`).
export function getMyRatingStats(): Promise<UserRatingStats> {
  return apiFetch<UserRatingStats>('ratings/me/stats');
}
