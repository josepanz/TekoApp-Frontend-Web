/**
 * TekoApp-Backend tiene versionado de rutas inconsistente: `app.enableVersioning()` sin
 * `defaultVersion` en main.ts hace que SOLO los controllers con `@Version('1')` vivan bajo
 * `/api/v1/*`; el resto vive en `/api/*` sin versión. Mapeado por dominio (primer segmento de la
 * ruta) — ver documentation/architecture.md. Si el backend versiona un dominio nuevo, agregarlo acá.
 */
const V1_DOMAINS = new Set(['auth', 'onboarding', 'roles', 'users', 'uploads']);

/** Endpoints del backend que requieren Basic Auth de cliente (no JWT de usuario) — ver architecture.md. */
const BASIC_AUTH_PATHS = new Set([
  'auth/login',
  'auth/create-password',
  'auth/forgot-password',
  'auth/refresh-token',
  'auth/verification-status',
  'auth/email/send-verification',
  'auth/email/send-create-password',
  'auth/email/send-password-reset',
  'onboarding',
]);

/** Construye la URL real del backend para un path relativo pedido por el frontend (ej. "users" o "auth/scope"). */
export function resolveBackendPath(path: string): string {
  const domain = path.split('/')[0];
  const prefix = V1_DOMAINS.has(domain) ? 'v1/' : '';
  return `${prefix}${path}`;
}

export function requiresBasicAuth(path: string): boolean {
  return BASIC_AUTH_PATHS.has(path);
}
