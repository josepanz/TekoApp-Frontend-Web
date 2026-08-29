import { apiFetch } from '@/core/api-client/client';
import type { components } from '@/core/api-client/types.generated';

export type ServiceProgressListResponse =
  components['schemas']['ServiceProgressListResponseDTO'];
export type ServiceProgressEntry =
  components['schemas']['ServiceProgressEntryResponseDTO'];

// GET /services/:id/progress (ServiceProgressController_list) — el backend autoriza tanto a los
// participantes (cliente dueño, profesional asignado) como a staff con el permiso
// service-progress.audit:read o admin:all (ver TekoApp-Backend/openspec/specs/work-progress-log.md,
// decisión de alcance confirmada 2026-08-27). Este admin solo cubre el caso de staff — el
// componente que llama a esto se renderiza únicamente si el usuario logueado tiene alguno de esos
// 2 permisos (ver service-progress-section.tsx), para no mostrar una sección condenada a 403.
export function getServiceProgress(
  serviceId: string,
): Promise<ServiceProgressListResponse> {
  return apiFetch<ServiceProgressListResponse>(
    `services/${serviceId}/progress`,
  );
}

// GET /uploads/presigned-url?key= — `images` de una entrada de bitácora son keys de S3, no URLs
// (mismo patrón que Services.images, que hoy tampoco se resuelve en ningún lado de este repo —
// gap preexistente, no se toca acá). Resolución fresca por foto, nunca cacheada más allá del
// tiempo de vida del componente que la muestra.
export function getPresignedUrl(key: string): Promise<{ url: string }> {
  return apiFetch<{ url: string }>(
    `uploads/presigned-url?key=${encodeURIComponent(key)}`,
  );
}
