import { http, HttpResponse } from 'msw';
import type {
  CreateRoleRequest,
  Role,
  RoleListResponse,
  RoleWithPermissions,
  UpdateRoleRequest,
} from '@/features/roles-permission/api';

export function buildRole(overrides: Partial<Role> = {}): Role {
  return {
    id: 1,
    referenceId: 'role-ref-001',
    name: 'MerchantAdmin',
    displayName: 'Administrador de comercio',
    description: 'Administrador del comercio con acceso completo',
    isActive: true,
    createdAt: '2024-01-15T10:30:00Z',
    createdBy: 'admin@correo.com.py',
    lastChangedAt: null,
    lastChangedBy: null,
    ...overrides,
  };
}

// RoleResponseDTO no incluye un arreglo de permisos (ver comentario en features/roles-permission
// /api.ts), así que "distintos permisos" se representa acá como roles con distinta descripción y
// estado -- los dos casos reales que sí devuelve el backend.
export const fakeRoles: Role[] = [
  buildRole(),
  buildRole({
    id: 2,
    name: 'SupportAgent',
    displayName: 'Agente de soporte',
    description:
      'Acceso de lectura a usuarios y servicios para el equipo de soporte',
    isActive: false,
  }),
];

export const fakeRolesListResponse: RoleListResponse = {
  roles: fakeRoles,
  total: fakeRoles.length,
  active: fakeRoles.filter((role) => role.isActive).length,
  inactive: fakeRoles.filter((role) => !role.isActive).length,
};

export function buildRoleWithPermissions(
  overrides: Partial<RoleWithPermissions> = {},
): RoleWithPermissions {
  return {
    id: 1,
    name: 'MerchantAdmin',
    displayName: 'Administrador de comercio',
    description: 'Administrador del comercio con acceso completo',
    isActive: true,
    permissions: [
      {
        id: 1,
        name: 'customers:read',
        displayName: 'Leer clientes',
        description: 'Permite leer información de clientes',
        isActive: true,
      },
    ],
    permissionsCount: 1,
    createdAt: '2024-01-15T10:30:00Z',
    createdBy: 'admin@correo.com.py',
    ...overrides,
  };
}

export const rolesHandlers = [
  http.get('/api/backend/roles', () =>
    HttpResponse.json(fakeRolesListResponse),
  ),

  http.post('/api/backend/roles', async ({ request }) => {
    const body = (await request.json()) as CreateRoleRequest;
    return HttpResponse.json(
      buildRole({
        id: 99,
        name: body.name,
        description: body.description ?? null,
      }),
      { status: 201 },
    );
  }),

  http.get('/api/backend/roles/:id', ({ params }) => {
    if (Number(params.id) !== 1) {
      return new HttpResponse(null, { status: 404 });
    }
    return HttpResponse.json(buildRoleWithPermissions());
  }),

  http.put('/api/backend/roles/:id', async ({ request, params }) => {
    const body = (await request.json()) as UpdateRoleRequest;
    const existing = fakeRoles.find((role) => role.id === Number(params.id));
    return HttpResponse.json(
      buildRole({
        id: Number(params.id),
        name: body.name ?? existing?.name,
        description: body.description ?? existing?.description ?? null,
        isActive: body.isActive ?? existing?.isActive ?? true,
      }),
    );
  }),
];
