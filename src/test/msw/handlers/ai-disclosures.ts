import { http, HttpResponse } from 'msw';
import type {
  AiDisclosure,
  AiDisclosuresListResponse,
} from '@/features/ai-disclosures/api';

export function buildAiDisclosure(
  overrides: Partial<AiDisclosure> = {},
): AiDisclosure {
  return {
    referenceId: 'ai-1',
    entityType: 'SERVICE_DESCRIPTION',
    entityReferenceId: 'svc-1',
    source: 'USER_DECLARED_AI',
    declaredByUserId: 5,
    createdAt: '2026-08-25T10:00:00.000Z',
    ...overrides,
  };
}

export const fakeAiDisclosuresPage1: AiDisclosuresListResponse = {
  data: [
    buildAiDisclosure(),
    buildAiDisclosure({
      referenceId: 'ai-2',
      entityType: 'PROFESSIONAL_DESCRIPTION',
      entityReferenceId: 'prof-1',
      source: 'PLATFORM_AI',
      declaredByUserId: undefined,
      aiProvider: 'openai',
    }),
  ],
  pagination: { total: 2, page: 1, pageSize: 10, totalPages: 1 },
};

export const aiDisclosuresHandlers = [
  http.get('/api/backend/admin/ai-disclosures', ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page') ?? '1');
    const entityType = url.searchParams.get('entityType');
    const source = url.searchParams.get('source');

    let data = fakeAiDisclosuresPage1.data;
    if (entityType) {
      data = data.filter((item) => item.entityType === entityType);
    }
    if (source) {
      data = data.filter((item) => item.source === source);
    }

    return HttpResponse.json({
      data,
      pagination: { ...fakeAiDisclosuresPage1.pagination, page },
    });
  }),
];
