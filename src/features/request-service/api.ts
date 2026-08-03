import { apiFetch } from '@/core/api-client/client';
import type { components } from '@/core/api-client/types.generated';

export type Category = components['schemas']['CategoryDetailResponseDTO'];
export type ServiceType = components['schemas']['ServiceTypeResponseDTO'];
export type CreateServiceRequest =
  components['schemas']['CreateServiceRequestDTO'];
export type Service = components['schemas']['ServiceDetailResponseDTO'];

// `GET /categories` (no `/all`) — a diferencia de `features/categories` (admin), acá se necesita
// solo el catálogo público (activo + visible), no el listado completo de administración.
export function getActiveCategories(): Promise<Category[]> {
  return apiFetch<Category[]>('categories');
}

export function getServiceTypes(): Promise<ServiceType[]> {
  return apiFetch<ServiceType[]>('service-types');
}

export function createServiceRequest(
  dto: CreateServiceRequest,
): Promise<Service> {
  return apiFetch<Service>('services', {
    method: 'POST',
    body: JSON.stringify(dto),
  });
}
