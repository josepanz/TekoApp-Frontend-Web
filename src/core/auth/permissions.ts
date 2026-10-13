/**
 * Espejo 1:1 de PERMISSIONS en TekoApp-Backend (src/common/enum/permissions.enum.ts).
 * Sin codegen automático — si el backend agrega/renombra un permiso, actualizar acá a mano.
 *
 * MERCHANT/BRANCH/GROUPING/ACCESS_ASSOCIATION/MOVEMENTS/CUSTOMERS (residuo de un template de
 * portal de comercios, no eran conceptos de dominio de TekoApp) se eliminaron del backend por no
 * tener ninguna referencia real — eliminados acá también para mantener el espejo. Los permisos de
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
  LEGAL: {
    CONFIG_MANAGE: 'legal.config:manage',
    CONSENT_AUDIT_VIEW: 'legal.consent-audit:read',
  },
  AI_DISCLOSURE: {
    AUDIT_VIEW: 'ai-disclosure.audit:read',
  },
  SERVICE_PROGRESS: {
    AUDIT_VIEW: 'service-progress.audit:read',
  },
  PROFESSIONAL_DOCUMENT_TYPES: {
    MANAGE: 'professional-document-types.catalog:manage',
  },
  PROFESSIONAL_DOCUMENTS: {
    REVIEW: 'professional-documents.review:manage',
  },
  PROFESSIONAL_PORTFOLIO: {
    REVIEW: 'professional-portfolio.review:manage',
  },
  PROFESSIONALS: {
    VERIFY: 'professionals.verification:manage',
  },
  CATEGORIES: {
    MANAGE: 'categories.catalog:manage',
  },
  MATERIAL_CATALOG: {
    MANAGE: 'material-catalog.catalog:manage',
  },
  CONTRACTS: {
    AUDIT_VIEW: 'contracts.audit:read',
  },
  RATINGS: {
    AUDIT_VIEW: 'ratings.audit:read',
  },
  PAYMENTS: {
    AUDIT_VIEW: 'payments.audit:read',
  },
  DISPUTES: {
    ADJUDICATE: 'disputes.adjudication:manage',
  },
  SYSTEM: {
    AUDIT_VIEW: 'system.audit:read',
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
 * Secciones del backoffice (`/admin/*`) y los permisos que dan acceso a cada una (semantica OR).
 * `href` es el prefijo de ruta de la seccion (incluye sus detalles). Los permisos salen de los
 * `@Permissions(...)` de los controllers del backend; `ADMIN.ALL` (superusuario) entra a todas.
 * Las secciones cuyo backend no exige un permiso propio (users/services/promotions/locations/
 * notifications...) quedan con el gate historico `DASHBOARD`.
 * El orden es el de aterrizaje: la primera seccion permitida es el destino por defecto.
 */
const ADMIN = PERMISSIONS.ADMIN.ALL;
const GENERAL = [ADMIN, PERMISSIONS.DASHBOARD] as const;

export const ADMIN_SECTIONS = [
  { id: 'dashboard', href: '/admin', permissions: GENERAL },
  {
    id: 'users',
    href: '/admin/users',
    permissions: [ADMIN, PERMISSIONS.USER.READ],
  },
  {
    id: 'professionals',
    href: '/admin/professionals',
    permissions: [ADMIN, PERMISSIONS.PROFESSIONALS.VERIFY],
  },
  { id: 'services', href: '/admin/services', permissions: GENERAL },
  {
    id: 'payments',
    href: '/admin/payments',
    permissions: [ADMIN, PERMISSIONS.PAYMENTS.AUDIT_VIEW],
  },
  { id: 'promotions', href: '/admin/promotions', permissions: GENERAL },
  {
    id: 'ratings',
    href: '/admin/ratings',
    permissions: [ADMIN, PERMISSIONS.RATINGS.AUDIT_VIEW],
  },
  {
    id: 'rolesPermission',
    href: '/admin/roles-permission',
    permissions: [ADMIN, PERMISSIONS.ROLE.READ],
  },
  {
    id: 'categories',
    href: '/admin/categories',
    permissions: [ADMIN, PERMISSIONS.CATEGORIES.MANAGE],
  },
  { id: 'locations', href: '/admin/locations', permissions: GENERAL },
  { id: 'notifications', href: '/admin/notifications', permissions: GENERAL },
  {
    id: 'aiDisclosures',
    href: '/admin/ai-disclosures',
    permissions: [ADMIN, PERMISSIONS.AI_DISCLOSURE.AUDIT_VIEW],
  },
  {
    id: 'professionalDocumentTypes',
    href: '/admin/professional-document-types',
    permissions: [ADMIN, PERMISSIONS.PROFESSIONAL_DOCUMENT_TYPES.MANAGE],
  },
  {
    id: 'professionalDocuments',
    href: '/admin/professional-documents',
    permissions: [ADMIN, PERMISSIONS.PROFESSIONAL_DOCUMENTS.REVIEW],
  },
  {
    id: 'professionalPortfolio',
    href: '/admin/professional-portfolio',
    permissions: [ADMIN, PERMISSIONS.PROFESSIONAL_PORTFOLIO.REVIEW],
  },
  {
    id: 'legalDocumentVersions',
    href: '/admin/legal/document-versions',
    permissions: [ADMIN, PERMISSIONS.LEGAL.CONFIG_MANAGE],
  },
  {
    id: 'dataRetentionPolicies',
    href: '/admin/legal/retention-policies',
    permissions: [ADMIN, PERMISSIONS.LEGAL.CONFIG_MANAGE],
  },
  {
    id: 'consentAudit',
    href: '/admin/legal/consent-audit',
    permissions: [ADMIN, PERMISSIONS.LEGAL.CONSENT_AUDIT_VIEW],
  },
  {
    id: 'materialCatalog',
    href: '/admin/material-catalog',
    permissions: [ADMIN, PERMISSIONS.MATERIAL_CATALOG.MANAGE],
  },
  {
    id: 'contracts',
    href: '/admin/contracts',
    permissions: [ADMIN, PERMISSIONS.CONTRACTS.AUDIT_VIEW],
  },
  {
    id: 'auditLog',
    href: '/admin/audit-log',
    permissions: [ADMIN, PERMISSIONS.SYSTEM.AUDIT_VIEW],
  },
] as const satisfies readonly {
  id: string;
  href: string;
  permissions: readonly Permission[];
}[];

export type AdminSection = (typeof ADMIN_SECTIONS)[number];
export type AdminSectionId = AdminSection['id'];

/** Todos los permisos que habilitan al menos una seccion del backoffice (lista de "staff"). */
export const STAFF_PERMISSIONS: readonly Permission[] = [
  ...new Set(ADMIN_SECTIONS.flatMap((section) => section.permissions)),
];

/**
 * Gate de entrada al modo Admin/staff (`/admin/*`): basta UN permiso de staff. Cada seccion
 * exige despues el suyo (ver `canAccessAdminSection` y `AdminSectionGate`).
 */
export function isStaffUser(userPermissions: readonly string[]): boolean {
  return hasAnyPermission(userPermissions, STAFF_PERMISSIONS);
}

export function canAccessAdminSection(
  userPermissions: readonly string[],
  id: AdminSectionId,
): boolean {
  const section = ADMIN_SECTIONS.find((s) => s.id === id);
  return !!section && hasAnyPermission(userPermissions, section.permissions);
}

/** Secciones del backoffice que el usuario puede ver, en el orden de `ADMIN_SECTIONS`. */
export function getAllowedAdminSections(
  userPermissions: readonly string[],
): AdminSection[] {
  return ADMIN_SECTIONS.filter((section) =>
    hasAnyPermission(userPermissions, section.permissions),
  );
}

/** Ruta de aterrizaje en `/admin/*`: la primera seccion permitida (o `null` si no es staff). */
export function getAdminLandingPath(
  userPermissions: readonly string[],
): string | null {
  return getAllowedAdminSections(userPermissions)[0]?.href ?? null;
}
