import { apiFetch } from '@/core/api-client/client';
import type { components } from '@/core/api-client/types.generated';

export type AiDisclosuresListResponse =
  components['schemas']['AiDisclosuresAdminListResponseDTO'];
export type AiDisclosure = components['schemas']['AiDisclosureResponseDTO'];
export type AiDisclosureEntityType = AiDisclosure['entityType'];
export type AiDisclosureSource = AiDisclosure['source'];

export interface GetAiDisclosuresParams {
  page: number;
  pageSize: number;
  entityType?: AiDisclosureEntityType;
  source?: AiDisclosureSource;
}

// GET /admin/ai-disclosures (AdminAiDisclosuresController_getAll) — listado agregado paginado
// para auditoría de staff, filtrable por entityType/source. Solo lectura: el disclosure lo crea
// el usuario dueño del contenido o, a futuro, una feature de IA de plataforma — nunca un admin a
// mano (ver TekoApp-Backend/openspec/specs/ai-content-disclosure.md).
export function getAiDisclosures({
  page,
  pageSize,
  entityType,
  source,
}: GetAiDisclosuresParams): Promise<AiDisclosuresListResponse> {
  const query = new URLSearchParams({
    page: String(page),
    pageSize: String(pageSize),
  });
  if (entityType) {
    query.set('entityType', entityType);
  }
  if (source) {
    query.set('source', source);
  }
  return apiFetch<AiDisclosuresListResponse>(
    `admin/ai-disclosures?${query.toString()}`,
  );
}
