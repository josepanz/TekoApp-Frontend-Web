import { http, HttpResponse } from 'msw';
import type {
  AdminProfessionalDocument,
  ProfessionalDocument,
} from '@/features/professional-documents/api';
import { buildProfessionalDocumentType } from './professional-document-types';

export function buildAdminProfessionalDocument(
  overrides: Partial<AdminProfessionalDocument> = {},
): AdminProfessionalDocument {
  return {
    referenceId: 'doc-1',
    professionalDocumentType: buildProfessionalDocumentType(),
    fileKey: 'abc123.jpg',
    status: 'PENDING',
    issuedAt: undefined,
    expiresAt: undefined,
    reviewedAt: undefined,
    rejectionReason: undefined,
    createdAt: '2026-08-27T10:00:00.000Z',
    professional: {
      referenceId: 'prof-1',
      firstName: 'Juan',
      lastName: 'Pérez',
    },
    ...overrides,
  };
}

export function buildProfessionalDocument(
  overrides: Partial<ProfessionalDocument> = {},
): ProfessionalDocument {
  return {
    referenceId: 'doc-1',
    professionalDocumentType: buildProfessionalDocumentType(),
    fileKey: 'abc123.jpg',
    status: 'PENDING',
    issuedAt: undefined,
    expiresAt: undefined,
    reviewedAt: undefined,
    rejectionReason: undefined,
    createdAt: '2026-08-27T10:00:00.000Z',
    ...overrides,
  };
}

export const professionalDocumentsHandlers = [
  http.get('/api/backend/admin/professional-documents', () => {
    return HttpResponse.json({
      data: [buildAdminProfessionalDocument()],
      pagination: { total: 1, page: 1, pageSize: 10, totalPages: 1 },
    });
  }),

  http.get('/api/backend/admin/professionals/:referenceId/documents', () => {
    return HttpResponse.json({ data: [buildProfessionalDocument()] });
  }),

  http.patch(
    '/api/backend/admin/professional-documents/:referenceId/review',
    async ({ request, params }) => {
      const body = (await request.json()) as {
        status: 'APPROVED' | 'REJECTED';
      };
      return HttpResponse.json(
        buildProfessionalDocument({
          referenceId: String(params.referenceId),
          status: body.status,
        }),
      );
    },
  ),

  http.get('/api/backend/uploads/presigned-url', () => {
    return HttpResponse.json({ url: 'https://s3.example.com/abc123.jpg' });
  }),
];
