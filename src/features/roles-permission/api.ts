import { apiFetch } from '@/core/api-client/client';
import type { components } from '@/core/api-client/types.generated';

export type Role = components['schemas']['RoleResponseDTO'];
export type RoleWithPermissions =
  components['schemas']['RoleWithPermissionsResponseDTO'];
export type RoleListResponse = components['schemas']['RoleListResponseDTO'];
export type CreateRoleRequest = components['schemas']['CreateRoleRequestDTO'];
export type UpdateRoleRequest = components['schemas']['UpdateRoleRequestDTO'];

// GET /v1/roles acepta filtros opcionales (page, pageSize, orderBy, search, isActive, etc.) pero
// RoleListResponseDTO (confirmado en types.generated.ts) NO expone metadata de paginación
// (page/totalPages) -- solo `roles` (la lista completa que matchea el filtro) + contadores
// total/active/inactive. No hay página/totalPages que pasarle al DataTable con lo que devuelve
// hoy el backend, así que se pide la lista completa sin parámetros y se renderiza sin paginación.
export function getRoles(): Promise<RoleListResponse> {
  return apiFetch<RoleListResponse>('roles');
}

// CreateRoleRequestDTO / UpdateRoleRequestDTO (confirmados en types.generated.ts) SOLO aceptan
// name/description (+ isActive en el update) -- el backend todavía NO expone un campo
// `permissions` para asociar permisos a un rol en esta capa de DTOs. La única asignación de
// permisos que existe hoy en el Swagger es a nivel de usuario (POST /users/{userId}/roles y
// /users/{userId}/permissions), explícitamente fuera de alcance de esta pasada (ver consigna del
// dominio). El formulario arma igual el selector de permisos (PermissionsPicker) para cuando el
// backend lo soporte, pero el payload real que viaja acá nunca incluye `permissions`.
export function createRole(dto: CreateRoleRequest): Promise<Role> {
  return apiFetch<Role>('roles', {
    method: 'POST',
    body: JSON.stringify(dto),
  });
}

export function updateRole(id: number, dto: UpdateRoleRequest): Promise<Role> {
  return apiFetch<Role>(`roles/${id}`, {
    method: 'PUT',
    body: JSON.stringify(dto),
  });
}

// GET /roles/{id} devuelve el rol junto con sus permisos asignados (RoleWithPermissionsResponseDTO)
// -- distinto del RoleResponseDTO plano que usa el listado.
export function getRoleById(id: number): Promise<RoleWithPermissions> {
  return apiFetch<RoleWithPermissions>(`roles/${id}`);
}

// No existe DELETE /roles/{id} en types.generated.ts (la ruta "/roles/{id}" solo declara
// get/put) -- no se implementa deleteRole ni un botón de eliminar en la tabla.
