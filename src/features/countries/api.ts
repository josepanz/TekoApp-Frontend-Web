import { apiFetch } from '@/core/api-client/client';
import type { components } from '@/core/api-client/types.generated';

export type Country = components['schemas']['CountryResponseDTO'];
export type CountriesListResponse =
  components['schemas']['GetCountriesListResponseDTO'];

export interface GetCountriesParams {
  page?: number;
  pageSize?: number;
  // Busca por nombre común/oficial o códigos ISO alfa-2/alfa-3 (ver Swagger de
  // `GET /countries`).
  search?: string;
}

export function getCountries({
  page = 1,
  pageSize = 20,
  search,
}: GetCountriesParams = {}): Promise<CountriesListResponse> {
  const query = new URLSearchParams({
    page: String(page),
    pageSize: String(pageSize),
  });
  if (search) {
    query.set('search', search);
  }
  return apiFetch<CountriesListResponse>(`countries?${query.toString()}`);
}
