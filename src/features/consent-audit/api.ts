import { apiFetch } from '@/core/api-client/client';
import type { components } from '@/core/api-client/types.generated';

export type UserConsentAudit =
  components['schemas']['UserConsentAuditResponseDTO'];
export type UserConsentsAuditListResponse =
  components['schemas']['LegalConsentsAuditListResponseDTO'];
export type ContentConsentGrantAudit =
  components['schemas']['ContentConsentGrantAuditResponseDTO'];
export type ContentConsentGrantsAuditListResponse =
  components['schemas']['ContentConsentGrantsAuditListResponseDTO'];
export type ConsentDocumentType =
  UserConsentAudit['legalDocumentVersion']['documentType'];
export type ContentConsentType = ContentConsentGrantAudit['contentType'];
export type ContentConsentUsageScope = ContentConsentGrantAudit['usageScope'];

export interface GetUserConsentsAuditParams {
  page: number;
  pageSize: number;
  documentType?: ConsentDocumentType;
  countryId?: number;
  userReferenceId?: string;
}

// GET /admin/legal/consents — auditoría paginada de UserConsents (pestaña "Aceptaciones de
// términos"). `countryId`/`userReferenceId` son inputs planos (id interno / UUID) en vez de un
// picker — no existe un feature de países ni un buscador de usuarios en este repo todavía, y
// construir uno solo para este filtro sería sobre-ingeniería para el alcance pedido.
export function getUserConsentsAudit({
  page,
  pageSize,
  documentType,
  countryId,
  userReferenceId,
}: GetUserConsentsAuditParams): Promise<UserConsentsAuditListResponse> {
  const query = new URLSearchParams({
    page: String(page),
    pageSize: String(pageSize),
  });
  if (documentType) query.set('documentType', documentType);
  if (countryId !== undefined) query.set('countryId', String(countryId));
  if (userReferenceId) query.set('userReferenceId', userReferenceId);
  return apiFetch<UserConsentsAuditListResponse>(
    `admin/legal/consents?${query.toString()}`,
  );
}

export interface GetContentConsentGrantsAuditParams {
  page: number;
  pageSize: number;
  contentType?: ContentConsentType;
  usageScope?: ContentConsentUsageScope;
  revoked?: boolean;
  uploaderReferenceId?: string;
}

// GET /admin/legal/content-consents — auditoría paginada de ContentConsentGrants (pestaña
// "Consentimiento de contenido"). `uploaderReferenceId` es un input plano por la misma razón que
// `userReferenceId` arriba.
export function getContentConsentGrantsAudit({
  page,
  pageSize,
  contentType,
  usageScope,
  revoked,
  uploaderReferenceId,
}: GetContentConsentGrantsAuditParams): Promise<ContentConsentGrantsAuditListResponse> {
  const query = new URLSearchParams({
    page: String(page),
    pageSize: String(pageSize),
  });
  if (contentType) query.set('contentType', contentType);
  if (usageScope) query.set('usageScope', usageScope);
  if (revoked !== undefined) query.set('revoked', String(revoked));
  if (uploaderReferenceId)
    query.set('uploaderReferenceId', uploaderReferenceId);
  return apiFetch<ContentConsentGrantsAuditListResponse>(
    `admin/legal/content-consents?${query.toString()}`,
  );
}
