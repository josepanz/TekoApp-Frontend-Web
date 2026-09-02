import { QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@/test/render';
import userEvent from '@testing-library/user-event';
import { HttpResponse, http } from 'msw';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { professionalPortfolioHandlers } from '@/test/msw/handlers/professional-portfolio';
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
});
