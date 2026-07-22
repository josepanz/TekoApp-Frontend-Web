import { apiFetch } from '@/core/api-client/client';
import type { components, operations } from '@/core/api-client/types.generated';

export type Professional =
  components['schemas']['ProfessionalDetailResponseDTO'];
export type ProfessionalsListResponse =
  components['schemas']['ProfessionalsListResponseDTO'];

export type BrowseProfessionalsParams = NonNullable<
  operations['ProfessionalsController_getProfessionals']['parameters']['query']
>;

export function browseProfessionals(
  params: BrowseProfessionalsParams = {},
): Promise<ProfessionalsListResponse> {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) query.set(key, String(value));
  });
  // Solo mostrar profesionales disponibles al público — no tiene sentido pedirle un servicio a
  // alguien marcado como no disponible.
  query.set('isAvailable', 'true');
  const queryString = query.toString();
  return apiFetch<ProfessionalsListResponse>(
    `professionals${queryString ? `?${queryString}` : ''}`,
  );
}

export function getProfessionalByReference(
  referenceId: string,
): Promise<Professional> {
  return apiFetch<Professional>(`professionals/reference/${referenceId}`);
}
