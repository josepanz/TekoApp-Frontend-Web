import { apiFetch } from '@/core/api-client/client';
import type { components } from '@/core/api-client/types.generated';

export type RetentionPolicy =
  components['schemas']['RetentionPolicyResponseDTO'];
export type RetentionPolicyContentType = RetentionPolicy['contentType'];
export type UpsertRetentionPolicyDto =
  components['schemas']['UpsertRetentionPolicyRequestDTO'];

// GET /admin/legal/retention-policies — catálogo NO paginado.
export function getRetentionPolicies(): Promise<RetentionPolicy[]> {
  return apiFetch<RetentionPolicy[]>('admin/legal/retention-policies');
}

// PATCH /admin/legal/retention-policies — upsert por (countryId, contentType), no por
// referenceId: el backend no tiene un endpoint separado de creación (ver
// TekoApp-Backend/openspec/decisions.md, extensión Fase 0006) — un mismo llamado sirve para crear
// una política nueva o actualizar la existente según si ya hay fila para esa combinación.
export function upsertRetentionPolicy(
  dto: UpsertRetentionPolicyDto,
): Promise<RetentionPolicy> {
  return apiFetch<RetentionPolicy>('admin/legal/retention-policies', {
    method: 'PATCH',
    body: JSON.stringify(dto),
  });
}
