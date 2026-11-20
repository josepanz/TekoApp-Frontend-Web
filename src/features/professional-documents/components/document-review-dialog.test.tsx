/**
 * Suite: DocumentReviewDialog (revision admin de un documento del profesional)
 * Casos: CP-WEB-IMG-005 (ver test/qa/casos/CP-ONB.md)
 * Tipo: unitaria (componente + MSW)   Prioridad: P1
 * Precondiciones: handlers MSW de professional-documents; sin backend real.
 * Trazabilidad: DEF-WEB-008 (presigned 403/404 sin aviso en la revision de documentos), M3.
 */
import { QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@/test/render';
import userEvent from '@testing-library/user-event';
import { HttpResponse, http } from 'msw';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { buildAdminProfessionalDocument } from '@/test/msw/handlers/professional-documents';
import { server } from '@/test/msw/server';
import { createTestQueryClient } from '@/test/query-client';
import { professionalDocumentsHandlers } from '@/test/msw/handlers/professional-documents';
import { DocumentReviewDialog } from './document-review-dialog';

beforeEach(() => {
  server.use(...professionalDocumentsHandlers);
});

function renderDialog(
  document = buildAdminProfessionalDocument(),
  onOpenChange = vi.fn(),
) {
  const queryClient = createTestQueryClient();
  return {
    onOpenChange,
    ...render(
      <QueryClientProvider client={queryClient}>
        <DocumentReviewDialog document={document} onOpenChange={onOpenChange} />
      </QueryClientProvider>,
    ),
  };
}

describe('DocumentReviewDialog', () => {
  it('muestra el tipo de documento y el nombre del profesional', async () => {
    // Arrange & Act
    renderDialog();

    // Assert
    expect(
      await screen.findByText('Antecedentes policiales'),
    ).toBeInTheDocument();
    expect(screen.getByText('Profesional: Juan Pérez')).toBeInTheDocument();
  });

  it('muestra el botón para ver el archivo una vez resuelta la URL presignada', async () => {
    // Arrange & Act
    renderDialog();

    // Assert
    expect(
      await screen.findByRole('button', { name: 'Ver archivo' }),
    ).toHaveAttribute('href', 'https://s3.example.com/abc123.jpg');
  });

  it('aprueba el documento y cierra el diálogo', async () => {
    // Arrange
    const user = userEvent.setup();
    const onReview = vi.fn();
    server.use(
      http.patch(
        '/api/backend/admin/professional-documents/:referenceId/review',
        async ({ request, params }) => {
          const body = (await request.json()) as { status: string };
          onReview(params.referenceId, body.status);
          return HttpResponse.json(
            buildAdminProfessionalDocument({ status: 'APPROVED' }),
          );
        },
      ),
    );
    const { onOpenChange } = renderDialog();
    await screen.findByText('Antecedentes policiales');

    // Act
    await user.click(screen.getByRole('button', { name: 'Aprobar' }));

    // Assert
    await waitFor(() => {
      expect(onReview).toHaveBeenCalledWith('doc-1', 'APPROVED');
    });
    await waitFor(() => {
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });
  });

  it('exige un motivo antes de confirmar el rechazo', async () => {
    // Arrange
    const user = userEvent.setup();
    renderDialog();
    await screen.findByText('Antecedentes policiales');

    // Act
    await user.click(screen.getByRole('button', { name: 'Rechazar' }));
    await user.click(screen.getByRole('button', { name: 'Confirmar rechazo' }));

    // Assert
    expect(
      await screen.findByText('El motivo de rechazo es obligatorio'),
    ).toBeInTheDocument();
  });

  it('rechaza el documento con el motivo indicado', async () => {
    // Arrange
    const user = userEvent.setup();
    const onReview = vi.fn();
    server.use(
      http.patch(
        '/api/backend/admin/professional-documents/:referenceId/review',
        async ({ request, params }) => {
          const body = (await request.json()) as {
            status: string;
            rejectionReason?: string;
          };
          onReview(params.referenceId, body.status, body.rejectionReason);
          return HttpResponse.json(
            buildAdminProfessionalDocument({ status: 'REJECTED' }),
          );
        },
      ),
    );
    renderDialog();
    await screen.findByText('Antecedentes policiales');

    // Act
    await user.click(screen.getByRole('button', { name: 'Rechazar' }));
    await user.type(
      screen.getByLabelText('Motivo de rechazo'),
      'Foto ilegible',
    );
    await user.click(screen.getByRole('button', { name: 'Confirmar rechazo' }));

    // Assert
    await waitFor(() => {
      expect(onReview).toHaveBeenCalledWith(
        'doc-1',
        'REJECTED',
        'Foto ilegible',
      );
    });
  });

  // DEF-WEB-008
  it('CP-WEB-IMG-005 avisa que el archivo no está disponible si el presigned responde 404', async () => {
    // Arrange
    server.use(
      http.get('/api/backend/uploads/presigned-url', () =>
        HttpResponse.json(
          {
            success: false,
            error: {
              code: 404,
              message: 'Archivo no encontrado',
              error: 'Not Found',
              timestamp: '2026-10-13T10:00:00.000Z',
              path: '/x',
            },
          },
          { status: 404 },
        ),
      ),
    );

    // Act
    renderDialog();

    // Assert
    expect(await screen.findByTestId('file-unavailable')).toHaveTextContent(
      'No se pudo cargar el archivo.',
    );
    expect(screen.queryByRole('button', { name: 'Ver archivo' })).toBeNull();
  });
});
