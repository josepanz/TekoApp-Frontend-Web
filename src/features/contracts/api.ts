import { apiFetch } from '@/core/api-client/client';
import type { components } from '@/core/api-client/types.generated';

export type ContractAudit = components['schemas']['ContractAuditResponseDTO'];
export type ContractsAuditListResponse =
  components['schemas']['ContractsAuditListResponseDTO'];
export type ContractStatus = ContractAudit['status'];

export interface GetAdminContractsParams {
  page: number;
  pageSize: number;
  status?: ContractStatus;
}

// GET /admin/contracts — gateado por CONTRACTS.AUDIT_VIEW en el backend. Solo lectura: la
// máquina de estados de firma vive en el backend y no se opera desde acá (ver F-01 del
// WORKPLAN).
export function getAdminContractsQueue({
  page,
  pageSize,
  status,
}: GetAdminContractsParams): Promise<ContractsAuditListResponse> {
  const query = new URLSearchParams({
    page: String(page),
    pageSize: String(pageSize),
  });
  if (status) query.set('status', status);
  return apiFetch<ContractsAuditListResponse>(
    `admin/contracts?${query.toString()}`,
  );
}
