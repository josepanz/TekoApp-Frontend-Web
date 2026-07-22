import { apiFetch } from '@/core/api-client/client';
import type { components, operations } from '@/core/api-client/types.generated';

export type Professional =
  components['schemas']['ProfessionalDetailResponseDTO'];
export type ProfessionalsListResponse =
  components['schemas']['ProfessionalsListResponseDTO'];
export type VerifyProfessionalRequest =
  components['schemas']['VerifyProfessionalRequestDTO'];
export type SuspendProfessionalRequest =
  components['schemas']['SuspendProfessionalRequestDTO'];

// El Swagger no nombra un DTO para el query de este listado — los params viven inline en la
// operación (`ProfessionalsController_getProfessionals`). Se referencia `operations[...]` en vez
// de copiar los campos a mano para no perder sincronía si el backend agrega/quita un filtro.
export type GetProfessionalsParams = NonNullable<
  operations['ProfessionalsController_getProfessionals']['parameters']['query']
>;

export function getProfessionals(
  params: GetProfessionalsParams = {},
): Promise<ProfessionalsListResponse> {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      query.set(key, String(value));
    }
  });
  const queryString = query.toString();
  return apiFetch<ProfessionalsListResponse>(
    `professionals${queryString ? `?${queryString}` : ''}`,
  );
}

export function verifyProfessional(
  id: number,
  dto: VerifyProfessionalRequest,
): Promise<Professional> {
  return apiFetch<Professional>(`professionals/${id}/verify`, {
    method: 'POST',
    body: JSON.stringify(dto),
  });
}

export function suspendProfessional(
  id: number,
  dto: SuspendProfessionalRequest,
): Promise<Professional> {
  return apiFetch<Professional>(`professionals/${id}/suspend`, {
    method: 'POST',
    body: JSON.stringify(dto),
  });
}
