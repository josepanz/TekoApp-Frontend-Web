import { http, HttpResponse } from 'msw';
import type { ContractAudit } from '@/features/contracts/api';

export function buildContractAudit(
  overrides: Partial<ContractAudit> = {},
): ContractAudit {
  return {
    referenceId: 'contract-1',
    status: 'SIGNED',
    serviceReferenceId: 'service-1',
    clientReferenceId: 'client-1',
    professionalReferenceId: 'prof-1',
    createdAt: '2026-09-01T10:00:00.000Z',
    clientSignedAt: '2026-09-01T11:00:00.000Z',
    professionalSignedAt: '2026-09-01T12:00:00.000Z',
    pdfAvailable: true,
    ...overrides,
  };
}

export const contractsHandlers = [
  http.get('/api/backend/admin/contracts', () => {
    return HttpResponse.json({
      data: [buildContractAudit()],
      pagination: { total: 1, page: 1, pageSize: 10, totalPages: 1 },
    });
  }),
];
