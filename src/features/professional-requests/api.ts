import { apiFetch } from '@/core/api-client/client';
import type { components } from '@/core/api-client/types.generated';

export type Service = components['schemas']['ServiceDetailResponseDTO'];
export type ServicesListResponse =
  components['schemas']['ServicesListResponseDTO'];

export interface GetPendingServicesParams {
  categoryId?: number;
  page?: number;
  pageSize?: number;
}

export function getPendingServices(
  params: GetPendingServicesParams,
): Promise<ServicesListResponse> {
  const query = new URLSearchParams({ status: 'PENDING' });
  if (params.categoryId !== undefined)
    query.set('categoryId', String(params.categoryId));
  if (params.page !== undefined) query.set('page', String(params.page));
  if (params.pageSize !== undefined)
    query.set('pageSize', String(params.pageSize));
  return apiFetch<ServicesListResponse>(`services?${query.toString()}`);
}

export function acceptService(id: string): Promise<Service> {
  return apiFetch<Service>(`services/${id}/accept`, { method: 'POST' });
}
