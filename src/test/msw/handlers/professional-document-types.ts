import { http, HttpResponse } from 'msw';
import type { ProfessionalDocumentType } from '@/features/professional-document-types/api';

export function buildProfessionalDocumentType(
  overrides: Partial<ProfessionalDocumentType> = {},
): ProfessionalDocumentType {
  return {
    referenceId: 'type-1',
    code: 'BG_CHECK_CRIMINAL_PY',
    name: 'Antecedentes policiales',
    description: undefined,
    category: 'BACKGROUND_CHECK',
    countryId: undefined,
    professionalCategoryId: undefined,
    isRequired: true,
    validityDays: 90,
    requiresStaffReview: true,
    isVisibleToClient: false,
    sortOrder: 0,
    isActive: true,
    ...overrides,
  };
}

export const professionalDocumentTypesHandlers = [
  http.get('/api/backend/professional-document-types', () => {
    return HttpResponse.json({
      data: [
        buildProfessionalDocumentType(),
        buildProfessionalDocumentType({
          referenceId: 'type-2',
          code: 'DEGREE_PLUMBING',
          name: 'Título técnico',
          category: 'QUALIFICATION',
          isRequired: false,
          validityDays: undefined,
        }),
      ],
    });
  }),

  http.post(
    '/api/backend/admin/professional-document-types',
    async ({ request }) => {
      const body = (await request.json()) as Partial<ProfessionalDocumentType>;
      return HttpResponse.json(
        buildProfessionalDocumentType({ referenceId: 'type-new', ...body }),
      );
    },
  ),

  http.patch(
    '/api/backend/admin/professional-document-types/:referenceId',
    async ({ request, params }) => {
      const body = (await request.json()) as Partial<ProfessionalDocumentType>;
      return HttpResponse.json(
        buildProfessionalDocumentType({
          referenceId: String(params.referenceId),
          ...body,
        }),
      );
    },
  ),
];
