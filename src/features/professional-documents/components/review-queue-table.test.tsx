import { QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@/test/render';
import userEvent from '@testing-library/user-event';
import { HttpResponse, http } from 'msw';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { professionalDocumentsHandlers } from '@/test/msw/handlers/professional-documents';
import { server } from '@/test/msw/server';
import { createTestQueryClient } from '@/test/query-client';
import { ReviewQueueTable } from './review-queue-table';

beforeEach(() => {
  server.use(...professionalDocumentsHandlers);
});

function renderTable() {
  const queryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <ReviewQueueTable />
    </QueryClientProvider>,
  );
}

describe('ReviewQueueTable', () => {
  it('muestra el nombre del profesional y el tipo de documento en cada fila', async () => {
    // Arrange & Act
    renderTable();

    // Assert
    expect(await screen.findByText('Juan Pérez')).toBeInTheDocument();
    expect(screen.getByText('Antecedentes policiales')).toBeInTheDocument();
  });

  it('abre el diálogo de revisión y aprueba el documento', async () => {
    // Arrange
    const user = userEvent.setup();
    const onReview = vi.fn();
    server.use(
      http.patch(
        '/api/backend/admin/professional-documents/:referenceId/review',
        async ({ request, params }) => {
          const body = (await request.json()) as { status: string };
          onReview(params.referenceId, body.status);
          return HttpResponse.json({
            referenceId: params.referenceId,
            professionalDocumentType: {
              referenceId: 'type-1',
              code: 'BG_CHECK_CRIMINAL_PY',
              name: 'Antecedentes policiales',
              category: 'BACKGROUND_CHECK',
              isRequired: true,
              requiresStaffReview: true,
              isVisibleToClient: false,
              sortOrder: 0,
              isActive: true,
            },
            fileKey: 'abc123.jpg',
            status: 'APPROVED',
            createdAt: '2026-08-27T10:00:00.000Z',
          });
        },
      ),
    );
    renderTable();
    await screen.findByText('Juan Pérez');

    // Act
    await user.click(screen.getByRole('button', { name: 'Revisar' }));
    await user.click(await screen.findByRole('button', { name: 'Aprobar' }));

    // Assert
    await waitFor(() => {
      expect(onReview).toHaveBeenCalledWith('doc-1', 'APPROVED');
    });
  });

  it('exige un motivo para rechazar el documento', async () => {
    // Arrange
    const user = userEvent.setup();
    renderTable();
    await screen.findByText('Juan Pérez');

    // Act
    await user.click(screen.getByRole('button', { name: 'Revisar' }));
    await user.click(await screen.findByRole('button', { name: 'Rechazar' }));
    await user.click(screen.getByRole('button', { name: 'Confirmar rechazo' }));

    // Assert
    expect(
      await screen.findByText('El motivo de rechazo es obligatorio'),
    ).toBeInTheDocument();
  });

  it('muestra un mensaje vacío cuando no hay documentos en la cola', async () => {
    // Arrange
    server.use(
      http.get('/api/backend/admin/professional-documents', () =>
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
        'No hay documentos que coincidan con los filtros.',
      ),
    ).toBeInTheDocument();
  });
});
