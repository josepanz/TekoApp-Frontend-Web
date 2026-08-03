import { apiFetch } from '@/core/api-client/client';
import type { components } from '@/core/api-client/types.generated';

export type OnlineCount = components['schemas']['OnlineCountResponseDTO'];

// `GET /locations/nearby` y `GET /locations/area` no están anotados con `@ApiResponse({ type })`
// en el backend (ver LocationsController) — devuelven filas crudas de Prisma `Professionals`
// (sin el `user`/`category` incluidos) más, solo en el caso de `/nearby`, un campo `distance`
// calculado en SQL. No hay DTO generado para esto; el tipo de acá se arma a mano leyendo
// `LocationsDbService.findNearby`/`findMany` en TekoApp-Backend. Los campos `Decimal` de Prisma
// (lat/lng/rating) pueden serializarse como number o string según el interceptor de serialización
// — siempre parsealos con `Number(...)` antes de usarlos, nunca asumas que ya vienen como number.
export interface NearbyProfessional {
  id: number;
  referenceId: string;
  categoryId: number;
  currentLatitude: number | string | null;
  currentLongitude: number | string | null;
  isAvailable: boolean;
  isOnline: boolean;
  averageRating: number | string;
  totalRatings: number;
  distance?: number;
}

export interface GetNearbyProfessionalsParams {
  latitude: number;
  longitude: number;
  radius?: number;
  categoryId?: string;
  limit?: number;
  availableOnly?: boolean;
  onlineOnly?: boolean;
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
  if (params.onlineOnly !== undefined)
    query.set('onlineOnly', String(params.onlineOnly));

  return apiFetch<NearbyProfessional[]>(`locations/nearby?${query.toString()}`);
}
