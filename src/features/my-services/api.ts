import { apiFetch } from '@/core/api-client/client';
import type { components } from '@/core/api-client/types.generated';

export type Service = components['schemas']['ServiceDetailResponseDTO'];
export type ServiceStatus = Service['status'];
export type CancelServiceRequest =
  components['schemas']['CancelServiceRequestDTO'];

export interface GetMyClientServicesParams {
  status?: ServiceStatus;
}

export function getMyClientServices(
  params: GetMyClientServicesParams,
): Promise<Service[]> {
  const query = new URLSearchParams({ role: 'client' });
  if (params.status) query.set('status', params.status);
  return apiFetch<Service[]>(`services/my-services?${query.toString()}`);
}

export function cancelService(
  id: string,
  dto: CancelServiceRequest,
): Promise<Service> {
  return apiFetch<Service>(`services/${id}`, {
    method: 'DELETE',
    body: JSON.stringify(dto),
  });
}
