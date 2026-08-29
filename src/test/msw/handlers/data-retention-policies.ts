import { http, HttpResponse } from 'msw';
import type { RetentionPolicy } from '@/features/data-retention-policies/api';

export function buildRetentionPolicy(
  overrides: Partial<RetentionPolicy> = {},
): RetentionPolicy {
  return {
    referenceId: 'policy-1',
    countryId: undefined,
    contentType: 'IMAGE',
    retentionDays: 365,
    allowsUserDeletion: true,
    requiresLegalHold: false,
    ...overrides,
  };
}

export const dataRetentionPoliciesHandlers = [
  http.get('/api/backend/admin/legal/retention-policies', () => {
    return HttpResponse.json([
      buildRetentionPolicy(),
      buildRetentionPolicy({
        referenceId: 'policy-2',
        contentType: 'PROGRESS_NOTE',
        retentionDays: undefined,
        requiresLegalHold: true,
      }),
    ]);
  }),

  http.patch(
    '/api/backend/admin/legal/retention-policies',
    async ({ request }) => {
      const body = (await request.json()) as Partial<RetentionPolicy>;
      return HttpResponse.json(buildRetentionPolicy(body));
    },
  ),
];
