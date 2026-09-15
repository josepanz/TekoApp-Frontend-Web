import { apiFetch } from '@/core/api-client/client';
import type { components } from '@/core/api-client/types.generated';

export type UsersListResponse = components['schemas']['UsersListResponseDTO'];
export type User = components['schemas']['UserResponseDTO'];
export type UpdateUserDto = components['schemas']['UpdateUserRequestDTO'];

export interface GetUsersParams {
  page: number;
  pageSize: number;
  // `name` SÍ existe en el backend (`ListUsersRequestDTO.name`, ver
  // `TekoApp-Backend/src/api/users/dtos/request/list-users.request.dto.ts`) y hace `contains` +
  // `mode: insensitive` sobre firstName/lastName (`UsersDBService.findAllUsers`) — no hay un
  // `search` unificado como en /professionals, así que esto es lo más cercano para buscar por
  // nombre. NO matchea por email/documentNumber (esos son filtros separados, exactos/contains
  // propios) — ver `global-search.tsx` para la limitación que esto impone en la búsqueda global.
  name?: string;
}

// GET /v1/users acepta paginación estándar (page/pageSize) más los filtros de
// `ListUsersRequestDTO` — el Swagger no documenta `description` para varios de sus campos
// (`name`/`email`/`documentNumber`), por eso no salen con comentario en
// `types.generated.ts`, pero sí están tipados y sí los aplica el backend.
export function getUsers({
  page,
  pageSize,
  name,
}: GetUsersParams): Promise<UsersListResponse> {
  const query = new URLSearchParams({
    page: String(page),
    pageSize: String(pageSize),
  });
  if (name) {
    query.set('name', name);
  }
  return apiFetch<UsersListResponse>(`users?${query.toString()}`);
}

export function getUserByReference(referenceId: string): Promise<User> {
  return apiFetch<User>(`users/reference/${referenceId}`);
}

export function updateUserByReference(
  referenceId: string,
  dto: UpdateUserDto,
): Promise<User> {
  return apiFetch<User>(`users/reference/${referenceId}`, {
    method: 'PUT',
    body: JSON.stringify(dto),
  });
}
