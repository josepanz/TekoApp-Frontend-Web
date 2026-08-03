import 'server-only';
import { createHash, randomUUID } from 'node:crypto';

// Correlación de requests para el logging estructurado. Dos identificadores:
//
// - `x-request-id`: si la request entrante ya lo trae, se reusa (correlación punta a punta con el
//   cliente / otros servicios); si no, se genera uno nuevo. Los route handlers lo escriben también
//   en la RESPONSE para que el cliente pueda correlacionar. NOTA: el middleware (`src/proxy.ts`) no
//   puede ser el único punto de inyección porque su `matcher` excluye `/api` — por eso cada route
//   handler bajo `app/api/**` resuelve su propio request-id con `resolveRequestId`.
//
// - `session-id`: NUNCA se loguea el access token (JWT httpOnly). Como identificador estable de
//   sesión se usa un hash SHA-256 truncado del token: correlaciona todas las requests de una misma
//   sesión sin exponer el token ni permitir revertirlo. Si no hay cookie, se omite.

export const REQUEST_ID_HEADER = 'x-request-id';

export function resolveRequestId(headers: Headers): string {
  return headers.get(REQUEST_ID_HEADER) ?? randomUUID();
}

export function deriveSessionId(
  accessToken: string | undefined | null,
): string | undefined {
  if (!accessToken) return undefined;
  return createHash('sha256').update(accessToken).digest('hex').slice(0, 12);
}
