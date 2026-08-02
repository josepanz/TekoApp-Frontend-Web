import { QueryClientProvider } from '@tanstack/react-query';
import userEvent from '@testing-library/user-event';
import { HttpResponse, http } from 'msw';
import { describe, expect, it } from 'vitest';
import { render, screen, waitFor } from '@/test/render';
import { createTestQueryClient } from '@/test/query-client';
import { server } from '@/test/msw/server';
import { fakeNotifications } from '@/test/msw/handlers/notifications';
import { NotificationBell } from './notification-bell';

function renderBell() {
  const queryClient = createTestQueryClient();
  render(
    <QueryClientProvider client={queryClient}>
      <NotificationBell />
    </QueryClientProvider>,
  );
}

describe('NotificationBell', () => {
  it('muestra el contador de no leídas en la campanita', async () => {
    // Arrange & Act
    renderBell();

    // Assert
    expect(await screen.findByText('2')).toBeInTheDocument();
  });

  it('muestra las últimas notificaciones al abrir el menú', async () => {
    // Arrange
    const user = userEvent.setup();
    renderBell();
    await screen.findByText('2');

    // Act
    await user.click(screen.getByRole('button', { name: 'Notificaciones' }));

    // Assert
    expect(
      await screen.findByText(fakeNotifications[0].title),
    ).toBeInTheDocument();
  });

  it('marca todas como leídas al hacer clic en la acción', async () => {
    // Arrange
    let markAllCalled = false;
    server.use(
      http.put('/api/backend/notifications/read-all', () => {
        markAllCalled = true;
        return new HttpResponse(null, { status: 204 });
      }),
    );
    const user = userEvent.setup();
    renderBell();
    await screen.findByText('2');
    await user.click(screen.getByRole('button', { name: 'Notificaciones' }));

    // Act
    await user.click(
      await screen.findByRole('button', { name: 'Marcar todas como leídas' }),
    );

    // Assert
    await waitFor(() => expect(markAllCalled).toBe(true));
  });

  it('muestra el estado vacío cuando no hay notificaciones', async () => {
    // Arrange
    server.use(
      http.get('/api/backend/notifications', () => HttpResponse.json([])),
      http.get('/api/backend/notifications/unread/count', () =>
        HttpResponse.json({ count: 0 }),
      ),
    );
    const user = userEvent.setup();
    renderBell();

    // Act
    await user.click(screen.getByRole('button', { name: 'Notificaciones' }));

    // Assert
    expect(
      await screen.findByText('No tenés notificaciones todavía'),
    ).toBeInTheDocument();
  });
});
