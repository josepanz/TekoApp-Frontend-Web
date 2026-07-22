import { QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HttpResponse, http } from 'msw';
import { describe, expect, it, vi } from 'vitest';
import { buildProfessional } from '@/test/msw/handlers/professionals';
import { server } from '@/test/msw/server';
import { createTestQueryClient } from '@/test/query-client';
import { SuspendProfessionalDialog } from './suspend-professional-dialog';

function renderDialog() {
  const queryClient = createTestQueryClient();
  const professional = buildProfessional({ id: 9, status: 'APPROVED' });
  render(
    <QueryClientProvider client={queryClient}>
      <SuspendProfessionalDialog professional={professional} />
    </QueryClientProvider>,
  );
}

describe('SuspendProfessionalDialog', () => {
  it('envía el motivo cargado al confirmar la suspensión', async () => {
    // Arrange
    const user = userEvent.setup();
    const onRequest = vi.fn();
    server.use(
      http.post(
        '/api/backend/professionals/:id/suspend',
        async ({ request, params }) => {
          const body = await request.json();
          onRequest(params.id, body);
          return HttpResponse.json(buildProfessional({ status: 'SUSPENDED' }));
        },
      ),
    );
    renderDialog();

    // Act
    await user.click(screen.getByRole('button', { name: 'Suspender' }));
    await user.type(
      await screen.findByLabelText('Motivo'),
      'Conducta inapropiada reportada',
    );
    await user.click(
      screen.getByRole('button', { name: 'Confirmar suspensión' }),
    );

    // Assert
    await waitFor(() => {
      expect(onRequest).toHaveBeenCalledWith('9', {
        reason: 'Conducta inapropiada reportada',
      });
    });
  }, 15000);

  it('muestra un error de validación y no envía la mutación si el motivo está vacío', async () => {
    // Arrange
    const user = userEvent.setup();
    const onRequest = vi.fn();
    server.use(
      http.post('/api/backend/professionals/:id/suspend', async () => {
        onRequest();
        return HttpResponse.json(buildProfessional({ status: 'SUSPENDED' }));
      }),
    );
    renderDialog();

    // Act
    await user.click(screen.getByRole('button', { name: 'Suspender' }));
    await user.click(
      screen.getByRole('button', { name: 'Confirmar suspensión' }),
    );

    // Assert
    expect(
      await screen.findByText('El motivo es obligatorio'),
    ).toBeInTheDocument();
    expect(onRequest).not.toHaveBeenCalled();
  }, 15000);
});
