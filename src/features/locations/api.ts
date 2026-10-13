import { apiFetch } from '@/core/api-client/client';
import type { components } from '@/core/api-client/types.generated';

export type OnlineCount = components['schemas']['OnlineCountResponseDTO'];

// Contrato NUEVO de `GET /locations/nearby` y `/locations/area`: rama `fix/hallazgos-exploracion-e2e`
// de TekoApp-Backend (`NearbyProfessionalResponseDTO`), todavia NO mergeada - por eso no esta en
// `types.generated.ts` (no se regenera hasta que el backend mergee) y se tipa a mano aca. Cambios
// respecto del contrato viejo: exige JWT, devuelve solo profesionales EN LINEA con posicion
// APROXIMADA (ofuscada ~200-300 m, determinista por dia) en `latitude`/`longitude` (ya no
// `currentLatitude`/`currentLongitude`) y `distanceKm` (ya no `distance`; solo en `nearby`). La
// coordenada exacta esta en `GET /locations/professional/:id` (solo admin/propio/cliente con
// servicio activo). Se parsea con Number() igual por robustez.
export interface NearbyProfessional {
  id: number;
  referenceId: string;
  categoryId: number;
  description: string;
  hourlyRate: number;
  latitude: number | string | null;
  longitude: number | string | null;
  distanceKm?: number;
  isAvailable: boolean;
  isOnline: boolean;
  averageRating: number | string;
}

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
