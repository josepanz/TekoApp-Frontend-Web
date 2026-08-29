import { http, HttpResponse } from 'msw';
import type { LegalDocumentVersion } from '@/features/legal-document-versions/api';

export function buildLegalDocumentVersion(
  overrides: Partial<LegalDocumentVersion> = {},
): LegalDocumentVersion {
  return {
    referenceId: 'version-1',
    documentType: 'TERMS_OF_SERVICE',
    countryId: undefined,
    version: '1.0.0',
    contentUrl: 'https://tekoapp.com.py/legal/tos-1.0.0',
    publishedAt: '2026-08-01T00:00:00.000Z',
    isActive: true,
    ...overrides,
  };
}

export const legalDocumentVersionsHandlers = [
  http.get('/api/backend/admin/legal/document-versions', () => {
    return HttpResponse.json([
      buildLegalDocumentVersion(),
      buildLegalDocumentVersion({
        referenceId: 'version-2',
        documentType: 'PRIVACY_POLICY',
        version: '2.1.0',
      }),
    ]);
  }),

  http.post(
    '/api/backend/admin/legal/document-versions',
    async ({ request }) => {
      const body = (await request.json()) as Partial<LegalDocumentVersion>;
      return HttpResponse.json(
        buildLegalDocumentVersion({ referenceId: 'version-new', ...body }),
      );
    },
  ),

  http.patch(
    '/api/backend/admin/legal/document-versions/:referenceId',
    async ({ request, params }) => {
      const body = (await request.json()) as Partial<LegalDocumentVersion>;
      return HttpResponse.json(
        buildLegalDocumentVersion({
          referenceId: String(params.referenceId),
          ...body,
        }),
      );
    },
  ),
];
