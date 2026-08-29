import { QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@/test/render';
import userEvent from '@testing-library/user-event';
import { HttpResponse, http } from 'msw';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { legalDocumentVersionsHandlers } from '@/test/msw/handlers/legal-document-versions';
import { server } from '@/test/msw/server';
import { createTestQueryClient } from '@/test/query-client';
import { LegalDocumentVersionsTable } from './legal-document-versions-table';

beforeEach(() => {
  server.use(...legalDocumentVersionsHandlers);
});

function renderTable() {
  const queryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <LegalDocumentVersionsTable />
    </QueryClientProvider>,
  );
}

describe('LegalDocumentVersionsTable', () => {
  it('muestra las versiones del catálogo una vez cargadas', async () => {
    // Arrange & Act
    renderTable();

    // Assert
    expect(await screen.findByText('1.0.0')).toBeInTheDocument();
    expect(screen.getByText('2.1.0')).toBeInTheDocument();
  });

  it('muestra un mensaje vacío cuando no hay versiones configuradas', async () => {
    // Arrange
    server.use(
      http.get('/api/backend/admin/legal/document-versions', () =>
        HttpResponse.json([]),
      ),
    );

    // Act
    renderTable();

    // Assert
    expect(
      await screen.findByText('Todavía no hay versiones cargadas.'),
    ).toBeInTheDocument();
  });

  it('muestra un mensaje de error si la carga falla', async () => {
    // Arrange
    server.use(
      http.get('/api/backend/admin/legal/document-versions', () =>
        HttpResponse.json({ message: 'Error interno' }, { status: 500 }),
      ),
    );

    // Act
    renderTable();

    // Assert
    expect(
      await screen.findByText('No se pudo cargar el catálogo.'),
    ).toBeInTheDocument();
  });

  it('permite editar una versión existente', async () => {
    // Arrange
    const user = userEvent.setup();
    const onUpdate = vi.fn();
    server.use(
      http.patch(
        '/api/backend/admin/legal/document-versions/:referenceId',
        async ({ request, params }) => {
          const body = (await request.json()) as { version?: string };
          onUpdate(params.referenceId, body.version);
          return HttpResponse.json({
            referenceId: params.referenceId,
            documentType: 'TERMS_OF_SERVICE',
            countryId: undefined,
            version: body.version,
            contentUrl: 'https://tekoapp.com.py/legal/tos-1.0.0',
            publishedAt: '2026-08-01T00:00:00.000Z',
            isActive: true,
          });
        },
      ),
    );
    renderTable();
    await screen.findByText('1.0.0');

    // Act
    const editButtons = await screen.findAllByRole('button', {
      name: 'Editar',
    });
    await user.click(editButtons[0]);
    const versionInput = await screen.findByLabelText('Versión');
    await user.clear(versionInput);
    await user.type(versionInput, '1.0.1');
    await user.click(screen.getByRole('button', { name: 'Guardar cambios' }));

    // Assert
    await waitFor(() => {
      expect(onUpdate).toHaveBeenCalledWith('version-1', '1.0.1');
    });
  });
});
