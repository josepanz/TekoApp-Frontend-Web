import 'server-only';
import { cookies } from 'next/headers';
import { env } from '@/core/config/env';
import { resolveBackendPath } from '@/core/api-client/backend-paths';

/**
 * Espejo de la respuesta de `GET /auth/scope` en TekoApp-Backend (`UserScopeResponseDTO`) — NO
 * del payload del JWT. El access token real es deliberadamente "delgado" (solo `sub`/email/status/
 * nombre) y no lleva `permissions`/`roles`/`id` embebidos — el backend los recalcula fresco en
 * cada request vía `JwtStrategy.validate()`. La única forma correcta de que el frontend conozca
 * los permisos del usuario es preguntarle al backend, no decodificar el JWT client-side.
 */
export interface SessionUser {
  referenceId: string;
  email: string;
  firstName: string;
  lastName: string;
  accessLevelId: number;
  userStatus: string;
  profileStatus: string;
  permissions: string[];
  roles: string[];
}

interface UserScopeResponse {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    status: string;
    profileStatus: string;
    accessLevelId: number;
  };
  roles?: { name: string }[];
  permissions?: { name: string }[];
}

function unwrapEnvelope(body: unknown): UserScopeResponse {
  if (body && typeof body === 'object' && 'data' in body) {
    return (body as { data: UserScopeResponse }).data;
  }
  return body as UserScopeResponse;
}

/**
 * El backend está caído/no responde (5xx, timeout, error de red) — nunca confundir esto con
 * "no hay sesión". Los 3 layouts que llaman `getSession()` hacen `if (!session) redirect('/login')`;
 * si esta clase de error devolviera `null` como un 401, una caída transitoria del backend
 * desloguearía a todos los usuarios activos. Se lanza para que el `error.tsx` más cercano lo
 * muestre en vez de silenciarlo.
 */
export class SessionUnavailableError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = 'SessionUnavailableError';
  }
}

/**
 * Lee la sesión actual pidiéndole al backend su propio scope.
 * - `null`: no hay sesión válida (sin cookie, o el backend respondió 401) — comportamiento
 *   correcto para redirigir a `/login`.
 * - Lanza `SessionUnavailableError`: el backend no respondió o respondió con un error que no es
 *   401 (5xx, error de red) — NO significa que la sesión no exista, significa que no se pudo
 *   verificar. El caller no debe tratarlo como logout.
 */
export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;
  if (!accessToken) return null;

  let response: Response;
  try {
    response = await fetch(
      `${env.BACKEND_API_URL}/${resolveBackendPath('auth/scope')}`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
        cache: 'no-store',
      },
    );
  } catch (error) {
    throw new SessionUnavailableError('No se pudo contactar al backend', {
      cause: error,
    });
  }

  if (response.status === 401) return null;
  if (!response.ok) {
    throw new SessionUnavailableError(
      `El backend respondió ${response.status} al verificar la sesión`,
    );
  }

  const scope = unwrapEnvelope(await response.json());

  return {
    referenceId: scope.user.id,
    email: scope.user.email,
    firstName: scope.user.firstName,
    lastName: scope.user.lastName,
    accessLevelId: scope.user.accessLevelId,
    userStatus: scope.user.status,
    profileStatus: scope.user.profileStatus,
    permissions: (scope.permissions ?? []).map((p) => p.name),
    roles: (scope.roles ?? []).map((r) => r.name),
  };
}
