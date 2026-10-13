import { getAdminLandingPath } from './permissions';

export interface LandingContext {
  /** `returnTo` (`?from=` que agrega `proxy.ts` al mandar a /login). Tiene prioridad si es valido. */
  from?: string | null;
  permissions: readonly string[];
  isProfessional: boolean;
}

/** Solo rutas internas (`/algo`): descarta URLs absolutas, protocol-relative (`//x`) y vacias. */
export function isSafeReturnPath(
  path: string | null | undefined,
): path is string {
  return (
    !!path &&
    path.startsWith('/') &&
    !path.startsWith('//') &&
    !path.startsWith('/\\') &&
    !/^\/(login|register)(\/|\?|$)/.test(path)
  );
}

/**
 * Destino despues del login: `from` si existe y es seguro; si no, por rol. Staff (admin ->
 * `/admin`, otros -> su primera seccion permitida), luego profesional (`/pro/solicitudes`) y cliente (`/`).
 */
export function resolvePostLoginPath({
  from,
  permissions,
  isProfessional,
}: LandingContext): string {
  if (isSafeReturnPath(from)) return from;
  const adminPath = getAdminLandingPath(permissions);
  if (adminPath) return adminPath;
  // Directo a la bandeja: evita el salto extra por el redirect de servidor de `/pro` (DEF-WEB-014).
  if (isProfessional) return '/pro/solicitudes';
  return '/';
}
