import { apiFetch } from '@/core/api-client/client';
import type { components } from '@/core/api-client/types.generated';

export type Service = components['schemas']['ServiceDetailResponseDTO'];
export type ServiceStatus = Service['status'];

export interface GetMyServicesParams {
  status?: ServiceStatus;
}

export function getMyServices(params: GetMyServicesParams): Promise<Service[]> {
  const query = new URLSearchParams({ role: 'professional' });
  if (params.status) query.set('status', params.status);
  return apiFetch<Service[]>(`services/my-services?${query.toString()}`);
}

export function startService(id: string): Promise<Service> {
  return apiFetch<Service>(`services/${id}/start`, { method: 'POST' });
}

export function completeService(id: string): Promise<Service> {
  return apiFetch<Service>(`services/${id}/complete`, { method: 'POST' });
}
