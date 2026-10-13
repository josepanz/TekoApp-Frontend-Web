import { apiFetch } from '@/core/api-client/client';

// GET /uploads/presigned-url?key= — URL firmada de corta vida (TTL <= 300 s). Responde 403 sin
// permiso sobre el archivo y 404 si la key no tiene registro. Nunca persistir la URL resuelta.
export function getPresignedUrl(key: string): Promise<{ url: string }> {
  return apiFetch<{ url: string }>(
    `uploads/presigned-url?key=${encodeURIComponent(key)}`,
  );
}
