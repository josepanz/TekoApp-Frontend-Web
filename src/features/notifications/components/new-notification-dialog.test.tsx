import { QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@/test/render';
import userEvent from '@testing-library/user-event';
import { HttpResponse, http } from 'msw';
import { describe, expect, it, vi } from 'vitest';
import { buildNotification } from '@/test/msw/handlers/notifications';
import { server } from '@/test/msw/server';
import { createTestQueryClient } from '@/test/query-client';
import { NewNotificationDialog } from './new-notification-dialog';

function renderDialog() {
  const queryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <NewNotificationDialog />
    </QueryClientProvider>,
  );
}

describe('NewNotificationDialog', () => {
  it('envía título, mensaje, tipo y canal por defecto al confirmar', async () => {
    // Arrange
    const user = userEvent.setup();
    const onRequest = vi.fn();
    server.use(
      http.post('/api/backend/notifications', async ({ request }) => {
        const body = await request.json();
        onRequest(body);
        return HttpResponse.json(buildNotification(), { status: 201 });
      }),
    );
    renderDialog();

    // Act
    await user.click(
      screen.getByRole('button', { name: 'Nueva notificación' }),
    );
    await user.type(
      await screen.findByLabelText('Título'),
      'Mantenimiento programado',
    );
    await user.type(
      screen.getByLabelText('Mensaje'),
      'El sistema estará en mantenimiento esta noche.',
    );
    await user.click(
      screen.getByRole('button', { name: 'Enviar notificación' }),
    );

    // Assert
    await waitFor(() => {
      expect(onRequest).toHaveBeenCalledWith({
        title: 'Mantenimiento programado',
        message: 'El sistema estará en mantenimiento esta noche.',
        type: 'system',
        channels: ['in_app'],
      });
    });
  });

  it('no envía la notificación si falta el título', async () => {
    // Arrange
    const user = userEvent.setup();
    const onRequest = vi.fn();
    server.use(
      http.post('/api/backend/notifications', async ({ request }) => {
        onRequest(await request.json());
        return HttpResponse.json(buildNotification(), { status: 201 });
      }),
    );
    renderDialog();

    // Act
    await user.click(
      screen.getByRole('button', { name: 'Nueva notificación' }),
    );
    await user.type(
      await screen.findByLabelText('Mensaje'),
      'Un mensaje sin título',
    );
    await user.click(
      screen.getByRole('button', { name: 'Enviar notificación' }),
    );

    // Assert
    expect(
      await screen.findByText('El título es obligatorio'),
    ).toBeInTheDocument();
    expect(onRequest).not.toHaveBeenCalled();
  });
});
