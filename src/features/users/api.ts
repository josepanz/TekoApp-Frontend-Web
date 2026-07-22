import { apiFetch } from '@/core/api-client/client';
import type { components } from '@/core/api-client/types.generated';

export type UsersListResponse = components['schemas']['UsersListResponseDTO'];
export type User = components['schemas']['UserResponseDTO'];

export interface GetUsersParams {
  page: number;
  pageSize: number;
}

// GET /v1/users no está anotado con @ApiQuery en el backend (el Swagger no documenta query
// params para este endpoint), pero sí acepta paginación estándar (page/pageSize) igual que el
// resto de los listados vía PrismaPaginationUtil — ver documentation/architecture.md.
export function getUsers({
  page,
  pageSize,
}: GetUsersParams): Promise<UsersListResponse> {
  const query = new URLSearchParams({
    page: String(page),
    pageSize: String(pageSize),
  });
  return apiFetch<UsersListResponse>(`users?${query.toString()}`);
}
