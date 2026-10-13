/**
 * Suite: Auditoría de consentimientos de usuario: filas, vacío y filtro por país/usuario con combobox
 * Casos: CP-WEB-ADMIN-011 (ver test/qa/casos/CP-ADMIN.md)
 * Tipo: integración (componente + MSW)   Prioridad: P2
 * Precondiciones: Vitest + jsdom + MSW (GET /api/backend/admin/legal/consents).
 * Trazabilidad: commit 0c0fb4a; openspec/specs/data-and-media-consent-admin.md
 */
import { QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@/test/render';
import userEvent from '@testing-library/user-event';
import { HttpResponse, http } from 'msw';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { consentAuditHandlers } from '@/test/msw/handlers/consent-audit';
import { server } from '@/test/msw/server';
import { createTestQueryClient } from '@/test/query-client';
import { UserConsentsAuditTable } from './user-consents-audit-table';

beforeEach(() => {
  server.use(...consentAuditHandlers);
});

function renderTable() {
  const queryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <UserConsentsAuditTable />
    </QueryClientProvider>,
  );
}

describe('UserConsentsAuditTable', () => {
  it('muestra el usuario, el documento y el hash de cada aceptación', async () => {
    // Arrange & Act
    renderTable();

    // Assert
    expect(await screen.findByText('Ana Gómez')).toBeInTheDocument();
    expect(screen.getByText('190.0.0.1')).toBeInTheDocument();
    expect(screen.getByText('abc123def456…')).toBeInTheDocument();
  });

  it('muestra un mensaje vacío cuando no hay aceptaciones que coincidan con los filtros', async () => {
    // Arrange
    server.use(
      http.get('/api/backend/admin/legal/consents', () =>
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
        'No hay aceptaciones que coincidan con los filtros.',
      ),
    ).toBeInTheDocument();
  });

  it('filtra por país y por usuario eligiendo de los combobox con búsqueda', async () => {
    // Arrange
    const user = userEvent.setup();
    const onRequest = vi.fn();
    server.use(
      http.get('/api/backend/admin/legal/consents', ({ request }) => {
        const url = new URL(request.url);
        onRequest(
          url.searchParams.get('countryId'),
          url.searchParams.get('userReferenceId'),
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
    await user.click(screen.getByLabelText('País'));
    await user.click(await screen.findByRole('option', { name: /Argentina/ }));
    await user.click(screen.getByLabelText('Usuario'));
    await user.click(
      await screen.findByRole('option', { name: /Ana González/ }),
    );

    // Assert
    await waitFor(() =>
      expect(onRequest).toHaveBeenLastCalledWith(
        '2',
        'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
      ),
    );
  });
});
