import { http, HttpResponse } from 'msw';
import type {
  ContentConsentGrantAudit,
  UserConsentAudit,
} from '@/features/consent-audit/api';
import { buildLegalDocumentVersion } from './legal-document-versions';

export function buildUserConsentAudit(
  overrides: Partial<UserConsentAudit> = {},
): UserConsentAudit {
  return {
    referenceId: 'consent-1',
    acceptedAt: '2026-08-20T10:00:00.000Z',
    legalDocumentVersion: buildLegalDocumentVersion(),
    user: { referenceId: 'user-1', firstName: 'Ana', lastName: 'Gómez' },
    ipAddress: '190.0.0.1',
    userAgent: 'jest-agent',
    acceptanceHash: 'abc123def456hash',
    ...overrides,
  };
}

export function buildContentConsentGrantAudit(
  overrides: Partial<ContentConsentGrantAudit> = {},
): ContentConsentGrantAudit {
  return {
    referenceId: 'grant-1',
    contentType: 'IMAGE',
    contentReferenceId: 'content-1',
    usageScope: 'APP_INTERNAL_ONLY',
    grantedAt: '2026-08-20T10:00:00.000Z',
    revokedAt: undefined,
    uploader: { referenceId: 'user-2', firstName: 'Juan', lastName: 'Pérez' },
    ...overrides,
  };
}

export const consentAuditHandlers = [
  http.get('/api/backend/admin/legal/consents', () => {
    return HttpResponse.json({
      data: [buildUserConsentAudit()],
      pagination: { total: 1, page: 1, pageSize: 10, totalPages: 1 },
    });
  }),

  http.get('/api/backend/admin/legal/content-consents', () => {
    return HttpResponse.json({
      data: [buildContentConsentGrantAudit()],
      pagination: { total: 1, page: 1, pageSize: 10, totalPages: 1 },
    });
  }),
];
