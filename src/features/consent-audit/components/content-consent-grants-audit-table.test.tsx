import { QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@/test/render';
import userEvent from '@testing-library/user-event';
import { HttpResponse, http } from 'msw';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { consentAuditHandlers } from '@/test/msw/handlers/consent-audit';
import { server } from '@/test/msw/server';
import { createTestQueryClient } from '@/test/query-client';
import { ContentConsentGrantsAuditTable } from './content-consent-grants-audit-table';

beforeEach(() => {
  server.use(...consentAuditHandlers);
});

function renderTable() {
  const queryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <ContentConsentGrantsAuditTable />
    </QueryClientProvider>,
  );
}

describe('ContentConsentGrantsAuditTable', () => {
  it('muestra quién subió el contenido y su estado vigente', async () => {
    // Arrange & Act
    renderTable();

    // Assert
    expect(await screen.findByText('Juan Pérez')).toBeInTheDocument();
    expect(screen.getByText('Vigente')).toBeInTheDocument();
  });

  it('muestra revocado cuando el grant tiene revokedAt', async () => {
    // Arrange
    server.use(
      http.get('/api/backend/admin/legal/content-consents', () =>
        HttpResponse.json({
          data: [
            {
              referenceId: 'grant-2',
              contentType: 'IMAGE',
              contentReferenceId: 'content-2',
              usageScope: 'APP_INTERNAL_ONLY',
              grantedAt: '2026-08-20T10:00:00.000Z',
              revokedAt: '2026-08-21T10:00:00.000Z',
              uploader: {
                referenceId: 'user-3',
                firstName: 'Marta',
                lastName: 'Ruiz',
              },
            },
          ],
          pagination: { total: 1, page: 1, pageSize: 10, totalPages: 1 },
        }),
      ),
    );

    // Act
    renderTable();

    // Assert
    expect(await screen.findByText('Revocado')).toBeInTheDocument();
  });

  it('muestra un mensaje vacío cuando no hay consentimientos que coincidan con los filtros', async () => {
    // Arrange
    server.use(
      http.get('/api/backend/admin/legal/content-consents', () =>
        HttpResponse.json({
          data: [],
          pagination: { total: 0, page: 1, pageSize: 10, totalPages: 0 },
        }),
      ),
    );

    // Act
    renderTable();

    // Assert
    expect(
      await screen.findByText(
        'No hay consentimientos que coincidan con los filtros.',
      ),
    ).toBeInTheDocument();
  });

  it('filtra por alcance de uso y por quién lo subió', async () => {
    // Arrange
    const user = userEvent.setup();
    const onRequest = vi.fn();
    server.use(
      http.get('/api/backend/admin/legal/content-consents', ({ request }) => {
        const url = new URL(request.url);
        onRequest(
          url.searchParams.get('usageScope'),
          url.searchParams.get('uploaderReferenceId'),
        );
        return HttpResponse.json({
          data: [],
          pagination: { total: 0, page: 1, pageSize: 10, totalPages: 0 },
        });
      }),
    );
    renderTable();
    await waitFor(() => expect(onRequest).toHaveBeenCalledWith(null, null));

    // Act
    await user.click(screen.getByRole('combobox', { name: 'Alcance de uso' }));
    await user.click(await screen.findByRole('option', { name: 'Marketing' }));
    await user.type(
      screen.getByLabelText('Subido por (referenceId)'),
      'user-7',
    );
    await user.tab();

    // Assert
    await waitFor(() =>
      expect(onRequest).toHaveBeenLastCalledWith('MARKETING', 'user-7'),
    );
  });
});
