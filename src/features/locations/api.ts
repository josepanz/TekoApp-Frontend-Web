import { apiFetch } from '@/core/api-client/client';
import type { components } from '@/core/api-client/types.generated';

export type OnlineCount = components['schemas']['OnlineCountResponseDTO'];

// Contrato de `GET /locations/nearby` y `/locations/area`: exige JWT, devuelve solo profesionales EN
// LINEA con posicion APROXIMADA (ofuscada ~200-300 m, determinista por dia). Tipo generado del OpenAPI.
export type NearbyProfessional =
  components['schemas']['NearbyProfessionalResponseDTO'];

export interface GetNearbyProfessionalsParams {
  latitude: number;
  longitude: number;
  radius?: number;
  categoryId?: string;
  limit?: number;
  availableOnly?: boolean;
}

export function getOnlineProfessionalsCount(): Promise<OnlineCount> {
  return apiFetch<OnlineCount>('locations/online-count');
}

export function getNearbyProfessionals(
  params: GetNearbyProfessionalsParams,
): Promise<NearbyProfessional[]> {
  const query = new URLSearchParams();
  query.set('latitude', String(params.latitude));
  query.set('longitude', String(params.longitude));
  if (params.radius !== undefined) query.set('radius', String(params.radius));
  if (params.categoryId) query.set('categoryId', params.categoryId);
  if (params.limit !== undefined) query.set('limit', String(params.limit));
  if (params.availableOnly !== undefined)
    query.set('availableOnly', String(params.availableOnly));

  return apiFetch<NearbyProfessional[]>(`locations/nearby?${query.toString()}`);
}
