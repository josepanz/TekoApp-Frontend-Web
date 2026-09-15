import { ApiError } from './errors';

// El backend real envuelve TODA respuesta exitosa en `{ success, data, message, timestamp, path }`
// vía un `TransformInterceptor` global (ver TekoApp-Backend `core/interceptors/transform.interceptor.ts`,
// registrado en `core/config/middleware.config.ts`) — nunca devuelve el DTO "pelado". Los mocks de
// MSW/fake-backend usados en tests SÍ devuelven el DTO sin envolver, así que el unwrap acá es
// defensivo: solo desenvuelve si el body calza con la forma del envelope, dejando pasar sin
// cambios cualquier respuesta ya "pelada" (para no romper los mocks existentes).
interface BackendEnvelope<T> {
  success: boolean;
  data: T;
}

export function isBackendEnvelope<T>(
  body: unknown,
): body is BackendEnvelope<T> {
  return (
    typeof body === 'object' &&
    body !== null &&
    'success' in body &&
    typeof (body as { success: unknown }).success === 'boolean' &&
    'data' in body
  );
}

// Hermano de `BackendEnvelope`/`isBackendEnvelope` para el camino de ERROR: `HttpExceptionFilter`
// (TekoApp-Backend, `src/common/filters/http-exception.filter.ts`) arma TODO error como
// `{success:false, error:{code,message,error,errorCode?,details?,timestamp,path}}` — nunca
// `message` en la raíz del body, a diferencia de lo que asumía `parseErrorResponse` hasta ahora
// (bug real: en producción, `ApiError.message` caía siempre al fallback genérico `Error {status}
// en {path}` para TODA la app, no solo una feature — confirmado leyendo el filtro real del
// backend). Los mocks de MSW y `e2e/fake-backend` devuelven el DTO "pelado" (`{message}`) a
// propósito, así que `extractErrorInfo` soporta las 2 formas.
interface BackendErrorEnvelope {
  success: false;
  error: {
    code: number;
    message: string;
    error: string;
    errorCode?: string;
    details?: unknown;
    timestamp: string;
    path: string;
  };
}

function isBackendErrorEnvelope(body: unknown): body is BackendErrorEnvelope {
  return (
    typeof body === 'object' &&
    body !== null &&
    'success' in body &&
    (body as { success: unknown }).success === false &&
    'error' in body &&
    typeof (body as { error: unknown }).error === 'object' &&
    (body as { error: unknown }).error !== null
  );
}

interface ExtractedErrorInfo {
  message: string;
  errorCode?: string;
  details?: unknown;
}

/**
 * Extrae `message`/`errorCode`/`details` de un body de error YA parseado (nunca hace fetch/parse
 * acá) — compartido por `parseErrorResponse` (client.ts) y por `features/auth/api.ts`
 * (`login`/`register`, que pegan a rutas dedicadas del BFF, no al proxy genérico, pero pueden
 * reenviar el mismo envelope real del backend tal cual). Soporta, en este orden: el envelope real
 * (`{success:false,error:{...}}`), y el DTO "pelado" (`{message}`) de los mocks — si ninguno de
 * los dos calza, devuelve `fallbackMessage`.
 */
export function extractErrorInfo(
  body: unknown,
  fallbackMessage: string,
): ExtractedErrorInfo {
  if (isBackendErrorEnvelope(body)) {
    return {
      message: body.error.message,
      errorCode: body.error.errorCode,
      details: body.error.details,
    };
  }
  if (body && typeof body === 'object' && 'message' in body) {
    const raw = (body as { message: unknown }).message;
    return { message: typeof raw === 'string' ? raw : fallbackMessage };
  }
  return { message: fallbackMessage };
}

/**
 * Parsea el cuerpo de una respuesta no-ok en un `ApiError` — compartido por `apiFetch`,
 * `uploadFile` y `downloadFile` para no duplicar el mismo try/parse en las tres (mismo motivo que
 * C-04 del WORKPLAN de hardening).
 */
async function parseErrorResponse(
  response: Response,
  path: string,
): Promise<ApiError> {
  let body: unknown;
  try {
    body = await response.json();
  } catch {
    body = await response.text();
  }
  const { message, errorCode, details } = extractErrorInfo(
    body,
    `Error ${response.status} en ${path}`,
  );
  return new ApiError(response.status, message, body, errorCode, details);
}

/**
 * Cliente de datos usado por `features/*\/api.ts` en Client Components (hooks de TanStack Query).
 * SIEMPRE pega a `/api/backend/*` (el proxy BFF) — nunca a la URL real del backend, que ni
 * siquiera está disponible en este contexto (solo vive en env vars server-only).
 */
export async function apiFetch<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const response = await fetch(`/api/backend/${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
    },
  });

  if (!response.ok) {
    throw await parseErrorResponse(response, path);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const body: unknown = await response.json();
  return (isBackendEnvelope<T>(body) ? body.data : body) as T;
}

export interface DownloadedFile {
  blob: Blob;
  filename: string;
}

/** Extrae el filename de un header `Content-Disposition: attachment; filename="...".` */
function extractFilename(response: Response, fallback: string): string {
  const disposition = response.headers.get('content-disposition');
  if (!disposition) return fallback;
  const match = /filename\*?=(?:UTF-8''|")?([^";]+)"?/i.exec(disposition);
  return match?.[1] ?? fallback;
}

/**
 * Descarga un archivo binario (CSV/Excel/PDF) servido por el backend vía `StreamableFile` +
 * `Content-Disposition: attachment` (ver `FileDownloadInterceptor` en TekoApp-Backend). A
 * diferencia de `apiFetch`, NUNCA hace `.json()` sobre un body exitoso: el envelope
 * `{success,data}` del `TransformInterceptor` no aplica a una respuesta binaria (el backend no lo
 * envuelve para estos endpoints). El error 4xx/5xx sí sigue siendo JSON, así que reusa
 * `parseErrorResponse` sin cambios.
 */
export async function downloadFile(
  path: string,
  fallbackFilename: string,
): Promise<DownloadedFile> {
  const response = await fetch(`/api/backend/${path}`);

  if (!response.ok) {
    throw await parseErrorResponse(response, path);
  }

  const blob = await response.blob();
  return { blob, filename: extractFilename(response, fallbackFilename) };
}

interface UploadFileOptions {
  /** Nombre del campo del archivo en el form — default `'file'` (convención de NestJS/Multer). */
  fieldName?: string;
  /** Campos adicionales del DTO que viajan junto al archivo (ej. `professionalDocumentTypeReferenceId`). */
  fields?: Record<string, string>;
}

/**
 * Sube un archivo vía `multipart/form-data` (avatar, documentos, etc.). NUNCA reusar `apiFetch`
 * para esto — fuerza `Content-Type: application/json`, que rompe el multipart. Acá se deja que
 * el browser calcule el `Content-Type` (con el boundary) automáticamente al pasar un `FormData`.
 */
export async function uploadFile<T>(
  path: string,
  file: File,
  options?: UploadFileOptions,
): Promise<T> {
  const { fieldName = 'file', fields } = options ?? {};
  const formData = new FormData();
  formData.append(fieldName, file);
  for (const [key, value] of Object.entries(fields ?? {})) {
    formData.append(key, value);
  }

  const response = await fetch(`/api/backend/${path}`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw await parseErrorResponse(response, path);
  }

  const body: unknown = await response.json();
  return (isBackendEnvelope<T>(body) ? body.data : body) as T;
}
