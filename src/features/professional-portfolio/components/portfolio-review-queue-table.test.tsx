import { QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor, within } from '@/test/render';
import userEvent from '@testing-library/user-event';
import { HttpResponse, http } from 'msw';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  buildAdminPortfolioItem,
  professionalPortfolioHandlers,
} from '@/test/msw/handlers/professional-portfolio';
import { server } from '@/test/msw/server';
import { createTestQueryClient } from '@/test/query-client';
import { PortfolioReviewQueueTable } from './portfolio-review-queue-table';

beforeEach(() => {
  server.use(...professionalPortfolioHandlers);
});

function renderTable() {
  const queryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <PortfolioReviewQueueTable />
    </QueryClientProvider>,
  );
}

describe('PortfolioReviewQueueTable', () => {
  it('muestra el nombre del profesional y la descripción de la foto en cada fila', async () => {
    // Arrange & Act
    renderTable();

    // Assert
    expect(await screen.findByText('Juan Pérez')).toBeInTheDocument();
    expect(screen.getByText('Instalación de cañerías')).toBeInTheDocument();
  });

  it('abre el diálogo de revisión y aprueba la foto', async () => {
    // Arrange
    const user = userEvent.setup();
    const onReview = vi.fn();
    server.use(
      http.patch(
        '/api/backend/admin/professional-portfolio/:referenceId/review',
        async ({ request, params }) => {
          const body = (await request.json()) as { status: string };
          onReview(params.referenceId, body.status);
          return HttpResponse.json({
            referenceId: params.referenceId,
            fileKey: 'portfolio-abc123.jpg',
            sortOrder: 0,
            isVisible: true,
            status: 'APPROVED',
            createdAt: '2026-09-01T10:00:00.000Z',
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
      expect(onReview).toHaveBeenCalledWith('portfolio-1', 'APPROVED');
    });
  });

  it('exige un motivo para rechazar la foto', async () => {
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

  it('muestra un mensaje vacío cuando no hay fotos en la cola', async () => {
    // Arrange
    server.use(
      http.get('/api/backend/admin/professional-portfolio', () =>
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
      await screen.findByText('No hay fotos que coincidan con los filtros.'),
    ).toBeInTheDocument();
  });

  function mockTwoItemQueue() {
    server.use(
      http.get('/api/backend/admin/professional-portfolio', () =>
        HttpResponse.json({
          data: [
            buildAdminPortfolioItem({
              referenceId: 'portfolio-1',
              caption: 'Instalación de cañerías',
            }),
            buildAdminPortfolioItem({
              referenceId: 'portfolio-2',
              caption: 'Reparación de grifería',
              professional: {
                referenceId: 'prof-2',
                firstName: 'María',
                lastName: 'López',
              },
            }),
          ],
          pagination: { total: 2, page: 1, pageSize: 10, totalPages: 1 },
        }),
      ),
    );
  }

  it('aprueba en bloque las fotos seleccionadas cuando todas las llamadas tienen éxito', async () => {
    // Arrange
    const user = userEvent.setup();
    mockTwoItemQueue();
    const reviewedIds: string[] = [];
    server.use(
      http.patch(
        '/api/backend/admin/professional-portfolio/:referenceId/review',
        ({ params }) => {
          reviewedIds.push(String(params.referenceId));
          return HttpResponse.json(
            buildAdminPortfolioItem({
              referenceId: String(params.referenceId),
              status: 'APPROVED',
            }),
          );
        },
      ),
    );
    renderTable();
    await screen.findByText('Instalación de cañerías');

    // Act
    const rowCheckboxes = screen.getAllByRole('checkbox', {
      name: 'Seleccionar fila',
    });
    await user.click(rowCheckboxes[0]);
    await user.click(rowCheckboxes[1]);
    await user.click(
      screen.getByRole('button', { name: 'Aprobar seleccionadas (2)' }),
    );
    const dialog = await screen.findByRole('alertdialog');
    await user.click(within(dialog).getByRole('button', { name: 'Confirmar' }));

    // Assert
    await waitFor(() => {
      expect(reviewedIds.sort()).toEqual(['portfolio-1', 'portfolio-2']);
    });
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
  });

  it('exige un motivo para rechazar en bloque y aplica el mismo motivo a todas las llamadas', async () => {
    // Arrange
    const user = userEvent.setup();
    mockTwoItemQueue();
    const reviewCalls: {
      referenceId: string;
      status: string;
      reason?: string;
    }[] = [];
    server.use(
      http.patch(
        '/api/backend/admin/professional-portfolio/:referenceId/review',
        async ({ request, params }) => {
          const body = (await request.json()) as {
            status: 'APPROVED' | 'REJECTED';
            rejectionReason?: string;
          };
          reviewCalls.push({
            referenceId: String(params.referenceId),
            status: body.status,
            reason: body.rejectionReason,
          });
          return HttpResponse.json(
            buildAdminPortfolioItem({
              referenceId: String(params.referenceId),
              status: body.status,
            }),
          );
        },
      ),
    );
    renderTable();
    await screen.findByText('Instalación de cañerías');

    // Act
    const rowCheckboxes = screen.getAllByRole('checkbox', {
      name: 'Seleccionar fila',
    });
    await user.click(rowCheckboxes[0]);
    await user.click(rowCheckboxes[1]);
    await user.click(
      screen.getByRole('button', { name: 'Rechazar seleccionadas (2)' }),
    );

    // Assert: exige el motivo antes de mandar cualquier request
    await user.click(
      await screen.findByRole('button', { name: 'Confirmar rechazo' }),
    );
    expect(
      await screen.findByText('El motivo de rechazo es obligatorio'),
    ).toBeInTheDocument();
    expect(reviewCalls).toHaveLength(0);

    // Act: completa el motivo y confirma
    await user.type(
      screen.getByLabelText(
        'Motivo de rechazo (se aplica a todas las fotos seleccionadas)',
      ),
      'No cumple con los estándares de calidad',
    );
    await user.click(screen.getByRole('button', { name: 'Confirmar rechazo' }));

    // Assert
    await waitFor(() => {
      expect(reviewCalls).toHaveLength(2);
    });
    expect(reviewCalls.every((call) => call.status === 'REJECTED')).toBe(true);
    expect(
      reviewCalls.every(
        (call) => call.reason === 'No cumple con los estándares de calidad',
      ),
    ).toBe(true);
  });

  it('reporta el fallo parcial y no bloquea el resto cuando alguna revisión en bloque falla', async () => {
    // Arrange
    const user = userEvent.setup();
    mockTwoItemQueue();
    server.use(
      http.patch(
        '/api/backend/admin/professional-portfolio/:referenceId/review',
        ({ params }) => {
          if (params.referenceId === 'portfolio-2') {
            return HttpResponse.json(
              { message: 'No autorizado' },
              { status: 403 },
            );
          }
          return HttpResponse.json(
            buildAdminPortfolioItem({
              referenceId: String(params.referenceId),
              status: 'APPROVED',
            }),
          );
        },
      ),
    );
    renderTable();
    await screen.findByText('Instalación de cañerías');

    // Act
    const rowCheckboxes = screen.getAllByRole('checkbox', {
      name: 'Seleccionar fila',
    });
    await user.click(rowCheckboxes[0]);
    await user.click(rowCheckboxes[1]);
    await user.click(
      screen.getByRole('button', { name: 'Aprobar seleccionadas (2)' }),
    );
    const dialog = await screen.findByRole('alertdialog');
    await user.click(within(dialog).getByRole('button', { name: 'Confirmar' }));

    // Assert: el diálogo se cierra y la selección se limpia pese al fallo parcial
    await waitFor(() => {
      expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
    });
    expect(
      screen.getAllByRole('checkbox', { name: 'Seleccionar fila' })[0],
    ).not.toBeChecked();
  });
});
