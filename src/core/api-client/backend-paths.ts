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

/**
 * Construye la URL real del backend para un path relativo pedido por el frontend (ej. "users" o
 * "auth/scope"). TekoApp-Backend ahora versiona TODAS sus rutas: `main.ts` setea
 * `defaultVersion: '1'` en `app.enableVersioning()`, así que todo controller (tenga o no
 * `@Version('1')` propio) vive bajo `/api/v1/*` — ver documentation/architecture.md. Antes solo 6
 * de 42 controllers estaban versionados y esta función prefijaba por dominio; ya no hace falta
 * esa lista.
 */
export function resolveBackendPath(path: string): string {
  return `v1/${path}`;
}

export function requiresBasicAuth(path: string): boolean {
  return BASIC_AUTH_PATHS.has(path);
}
