/**
 * Espejo 1:1 de PERMISSIONS en TekoApp-Backend (src/common/enum/permissions.enum.ts).
 * Sin codegen automático — si el backend agrega/renombra un permiso, actualizar acá a mano.
 *
 * Nota: MERCHANT/BRANCH/GROUPING/ACCESS_ASSOCIATION/MOVEMENTS/CUSTOMERS parecen residuo de un
 * template de portal de comercios (no son conceptos de dominio de TekoApp) — se mantienen porque
 * es lo que el backend realmente expone hoy, no porque apliquen a este proyecto. Los permisos de
 * professionals/services/payments/promotions/ratings del backend NO usan @Permissions() todavía
 * (solo JwtAuthGuard a nivel de clase) — ver documentation/architecture.md.
 */
export const PERMISSIONS = {
  ADMIN: {
    ALL: 'admin:all',
  },
  DASHBOARD: 'dashboard:read',
  USER: {
    CREATE: 'user:create',
    READ: 'user:read',
    UPDATE: 'user:update',
    DELETE: 'user:delete',
    CLIENTS: 'user.clients:read',
    PASSWORD: {
      CREATE: 'user.password:create',
      UPDATE: 'user.password:update',
    },
  },
  ROLE: {
    CREATE: 'role:create',
    READ: 'role:read',
    UPDATE: 'role:update',
    DELETE: 'role:delete',
  },
  PERMISSION: {
    CREATE: 'permission:create',
    READ: 'permission:read',
    UPDATE: 'permission:update',
    DELETE: 'permission:delete',
  },
  ASSIGNMENT: {
    ROLE_PERMISSION: 'role.permission.assignment:create',
    USER_PERMISSION: 'user.permission.assignment:create',
    UNASSIGN_USER: 'user.permission.unassignment:delete',
    UNASSIGN_ROLE: 'role.permission.unassignment:delete',
  },
  MERCHANT: {
    CREATE: 'merchant:create',
    READ: 'merchant:read',
    UPDATE: 'merchant:update',
    DELETE: 'merchant:delete',
    MANAGEMENT: 'merchant:management',
    WITH_SPI: 'merchant.spi:read',
    WITH_GIROS: 'merchant.giros:read',
  },
  BRANCH: {
    CREATE: 'branch:create',
    READ: 'branch:read',
    UPDATE: 'branch:update',
    DELETE: 'branch:delete',
  },
  GROUPING: {
    CREATE: 'merchant.grouping:create',
    READ: 'merchant.grouping:read',
    UPDATE: 'merchant.grouping:update',
    DELETE: 'merchant.grouping:delete',
  },
  ACCESS_ASSOCIATION: {
    CREATE: 'user.merchant.access.association:create',
    READ: 'user.merchant.access.association:read',
    UPDATE: 'user.merchant.access.association:update',
    DELETE: 'user.merchant.access.association:delete',
  },
  MOVEMENTS: {
    READ: 'movement:read',
  },
  CUSTOMERS: {
    CREATE: 'customers:create',
    READ: 'customers:read',
    UPDATE: 'customers:update',
    DELETE: 'customers:delete',
  },
} as const;

/** Todos los valores string posibles dentro de PERMISSIONS, aplanados (para el tipo de `user.permissions: string[]`). */
type FlattenPermissionValues<T> = T extends string
  ? T
  : T extends Record<string, unknown>
    ? { [K in keyof T]: FlattenPermissionValues<T[K]> }[keyof T]
    : never;

export type Permission = FlattenPermissionValues<typeof PERMISSIONS>;

/** true si `userPermissions` incluye ALGUNO de los permisos requeridos (semántica OR, igual que el backend). */
export function hasAnyPermission(
  userPermissions: readonly string[],
  required: readonly Permission[],
): boolean {
  return required.some((permission) => userPermissions.includes(permission));
}

/**
 * Gate de acceso al modo Admin/staff (`/admin/*`). No hay un permiso "admin" dedicado en el
 * backend todavía (ver nota arriba) — se usa `ADMIN.ALL` (superusuario) o `DASHBOARD` (acceso al
 * resumen/analytics, lo mínimo que cualquier staff necesita) como proxy de "es parte del staff".
 */
export function isStaffUser(userPermissions: readonly string[]): boolean {
  return hasAnyPermission(userPermissions, [
    PERMISSIONS.ADMIN.ALL,
    PERMISSIONS.DASHBOARD,
  ]);
}
