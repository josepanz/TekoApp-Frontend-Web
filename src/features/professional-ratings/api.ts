import { apiFetch } from '@/core/api-client/client';
import type { components } from '@/core/api-client/types.generated';

export type ReviewsListResponse =
  components['schemas']['ProfessionalReviewsListResponseDTO'];
export type CreateProfessionalToClientRatingRequest =
  components['schemas']['CreateProfessionalToClientRatingRequestDTO'];
export type Rating = components['schemas']['RatingDetailResponseDTO'];
export type ProfessionalRatingStats =
  components['schemas']['ProfessionalRatingStatsResponseDTO'];

export function getMyProfessionalRatingStats(
  professionalId: number,
): Promise<ProfessionalRatingStats> {
  return apiFetch<ProfessionalRatingStats>(
    `ratings/professional/${professionalId}/average`,
  );
}

export interface GetMyReviewsParams {
  page: number;
  pageSize: number;
}

export function getMyReviews(
  professionalId: number,
  params: GetMyReviewsParams,
): Promise<ReviewsListResponse> {
  const query = new URLSearchParams({
    page: String(params.page),
    pageSize: String(params.pageSize),
  });
  return apiFetch<ReviewsListResponse>(
    `professionals/${professionalId}/reviews?${query.toString()}`,
  );
}

export function rateClient(
  dto: CreateProfessionalToClientRatingRequest,
): Promise<Rating> {
  return apiFetch<Rating>('ratings/professional-to-client', {
    method: 'POST',
    body: JSON.stringify(dto),
  });
}
