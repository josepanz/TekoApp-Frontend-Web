import { apiFetch } from '@/core/api-client/client';
import type { components } from '@/core/api-client/types.generated';

export type CreateRatingRequest =
  components['schemas']['CreateRatingRequestDTO'];
export type Rating = components['schemas']['RatingDetailResponseDTO'];

export function rateProfessional(dto: CreateRatingRequest): Promise<Rating> {
  return apiFetch<Rating>('ratings', {
    method: 'POST',
    body: JSON.stringify(dto),
  });
}
