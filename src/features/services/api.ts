import { apiFetch } from '@/core/api-client/client';
import type { components } from '@/core/api-client/types.generated';

export type ServicesListResponse =
  components['schemas']['ServicesListResponseDTO'];
export type Service = components['schemas']['ServiceDetailResponseDTO'];
export type ServiceDetail = components['schemas']['ServiceDetailResponseDTO'];
export type ServiceStatus = Service['status'];

export interface GetServicesParams {
  page: number;
  pageSize: number;
  status?: ServiceStatus;
}

// GET /tekoapp-backend/api/services — listado paginado de servicios solicitados por clientes,
// filtrable por status (ver operación ServicesController_getServices en
// core/api-client/types.generated.ts). Dominio de solo lectura: el admin monitorea, no crea ni
// edita servicios (eso lo hace el cliente/profesional vía la app).
export function getServices({
  page,
  pageSize,
  status,
}: GetServicesParams): Promise<ServicesListResponse> {
  const query = new URLSearchParams({
    page: String(page),
    pageSize: String(pageSize),
  });
  if (status) {
    query.set('status', status);
  }
  return apiFetch<ServicesListResponse>(`services?${query.toString()}`);
}

// GET /services/:id (ServicesController_getServiceById) — detalle de un servicio puntual, con el
// mismo DTO que ya trae el listado (ServiceDetailResponseDTO) pero pedido por id en vez de venir
// embebido en una página. Guard del backend: solo JwtAuthGuard, sin permiso fino — cualquier admin
// autenticado puede ver el detalle de monitoreo.
export function getServiceById(id: string): Promise<ServiceDetail> {
  return apiFetch<ServiceDetail>(`services/${id}`);
}
