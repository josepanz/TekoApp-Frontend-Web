import {
  apiFetch,
  downloadFile,
  type DownloadedFile,
} from '@/core/api-client/client';
import type { components, operations } from '@/core/api-client/types.generated';

export type Professional =
  components['schemas']['ProfessionalDetailResponseDTO'];
export type ProfessionalsListResponse =
  components['schemas']['ProfessionalsListResponseDTO'];
export type VerifyProfessionalRequest =
  components['schemas']['VerifyProfessionalRequestDTO'];
export type SuspendProfessionalRequest =
  components['schemas']['SuspendProfessionalRequestDTO'];
export type ReactivateProfessionalRequest =
  components['schemas']['ReactivateProfessionalRequestDTO'];
export type ProfessionalStatusHistoryResponse =
  components['schemas']['ProfessionalStatusHistoryResponseDTO'];
export type ProfessionalStatusHistoryItem =
  components['schemas']['ProfessionalStatusHistoryItemDTO'];

// El Swagger no nombra un DTO para el query de este listado — los params viven inline en la
// operación (`ProfessionalsController_getProfessionals`). Se referencia `operations[...]` en vez
// de copiar los campos a mano para no perder sincronía si el backend agrega/quita un filtro.
export type GetProfessionalsParams = NonNullable<
  operations['ProfessionalsController_getProfessionals']['parameters']['query']
>;

export function getProfessionals(
  params: GetProfessionalsParams = {},
): Promise<ProfessionalsListResponse> {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      query.set(key, String(value));
    }
  });
  const queryString = query.toString();
  return apiFetch<ProfessionalsListResponse>(
    `professionals${queryString ? `?${queryString}` : ''}`,
  );
}

// GET /professionals/reference/{referenceId} (ProfessionalsController_findOneByReference) — el
// mismo endpoint público que consume `features/browse-professionals`, con su propia función acá
// para no acoplar el feature admin al de browse.
export function getProfessionalByReference(
  referenceId: string,
): Promise<Professional> {
  return apiFetch<Professional>(`professionals/reference/${referenceId}`);
}

export function verifyProfessional(
  id: number,
  dto: VerifyProfessionalRequest,
): Promise<Professional> {
  return apiFetch<Professional>(`professionals/${id}/verify`, {
    method: 'POST',
    body: JSON.stringify(dto),
  });
}

export function suspendProfessional(
  id: number,
  dto: SuspendProfessionalRequest,
): Promise<Professional> {
  return apiFetch<Professional>(`professionals/${id}/suspend`, {
    method: 'POST',
    body: JSON.stringify(dto),
  });
}

// POST /professionals/{id}/reactivate: SUSPENDED -> APPROVED (isAvailable/isOnline en false). `reason` obligatorio.
export function reactivateProfessional(
  id: number,
  dto: ReactivateProfessionalRequest,
): Promise<Professional> {
  return apiFetch<Professional>(`professionals/${id}/reactivate`, {
    method: 'POST',
    body: JSON.stringify(dto),
  });
}

// GET /professionals/{id}/status-history: transiciones de estado, mas recientes primero (pageSize max 100).
export function getProfessionalStatusHistory(
  id: number,
  params: { page: number; pageSize: number },
): Promise<ProfessionalStatusHistoryResponse> {
  const query = new URLSearchParams({
    page: String(params.page),
    pageSize: String(params.pageSize),
  });
  return apiFetch<ProfessionalStatusHistoryResponse>(
    `professionals/${id}/status-history?${query.toString()}`,
  );
}

// GET /admin/professionals/export (AdminProfessionalsExportController_export) — CSV solamente,
// sin paginar, mismos filtros que el listado público (incluye `search`). Gateado por
// PROFESSIONALS.VERIFY/ADMIN.ALL en el backend. Responde un StreamableFile sin envelope
// {success,data}, por eso usa `downloadFile` y no `apiFetch`.
export type ExportProfessionalsParams = NonNullable<
  operations['AdminProfessionalsExportController_export']['parameters']['query']
>;

export function exportProfessionals(
  params: ExportProfessionalsParams = {},
): Promise<DownloadedFile> {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      query.set(key, String(value));
    }
  });
  const queryString = query.toString();
  return downloadFile(
    `admin/professionals/export${queryString ? `?${queryString}` : ''}`,
    'profesionales.csv',
  );
}
