import { apiFetch } from '@/core/api-client/client';
import type { components } from '@/core/api-client/types.generated';

export type Professional =
  components['schemas']['ProfessionalDetailResponseDTO'];
export type UpdateProfessionalProfileRequest =
  components['schemas']['UpdateProfessionalRequestDTO'];
export type UpdateAvailabilityRequest =
  components['schemas']['UpdateAvailabilityRequestDTO'];

export function getMyProfessionalProfile(): Promise<Professional> {
  return apiFetch<Professional>('professionals/me');
}

export function updateMyProfessionalProfile(
  referenceId: string,
  dto: UpdateProfessionalProfileRequest,
): Promise<Professional> {
  return apiFetch<Professional>(`professionals/reference/${referenceId}`, {
    method: 'PUT',
    body: JSON.stringify(dto),
  });
}

export function updateMyAvailability(
  id: number,
  dto: UpdateAvailabilityRequest,
): Promise<Professional> {
  return apiFetch<Professional>(`professionals/${id}/availability`, {
    method: 'POST',
    body: JSON.stringify(dto),
  });
}
