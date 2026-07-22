import { apiFetch } from '@/core/api-client/client';
import type { components } from '@/core/api-client/types.generated';

export type Promotion = components['schemas']['PromotionDetailResponseDTO'];
export type CreatePromotionRequest =
  components['schemas']['CreatePromotionRequestDTO'];

// El Swagger no anota un `@ApiBody` para `PUT /promotions/{id}`
// (`PromotionsController_update` tiene `requestBody?: never` en types.generated.ts), pero el
// endpoint sí espera un body — no existe un `UpdatePromotionRequestDTO` separado en el OpenAPI
// generado, así que reutilizamos `CreatePromotionRequestDTO` como parcial en vez de inventar un
// tipo a mano.
export type UpdatePromotionRequest = Partial<CreatePromotionRequest>;

// GET /promotions no documenta query params (`parameters.query?: never`) y la respuesta es un
// array plano de `PromotionDetailResponseDTO` — a diferencia de /users, este listado no tiene
// wrapper de paginación `{data, pagination}` en el backend.
export function getPromotions(): Promise<Promotion[]> {
  return apiFetch<Promotion[]>('promotions');
}

export function createPromotion(
  dto: CreatePromotionRequest,
): Promise<Promotion> {
  return apiFetch<Promotion>('promotions', {
    method: 'POST',
    body: JSON.stringify(dto),
  });
}

export function updatePromotion(
  id: string,
  dto: UpdatePromotionRequest,
): Promise<Promotion> {
  return apiFetch<Promotion>(`promotions/${id}`, {
    method: 'PUT',
    body: JSON.stringify(dto),
  });
}

// DELETE /promotions/{id} es un soft delete (desactiva la promoción, no la borra) — el backend
// documenta la respuesta 200 como la `PromotionDetailResponseDTO` ya desactivada.
export function deletePromotion(id: string): Promise<Promotion> {
  return apiFetch<Promotion>(`promotions/${id}`, {
    method: 'DELETE',
  });
}
