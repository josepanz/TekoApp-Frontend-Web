import { QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@/test/render';
import userEvent from '@testing-library/user-event';
import { HttpResponse, http } from 'msw';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  fakeNotifications,
  notificationsHandlers,
} from '@/test/msw/handlers/notifications';
import { server } from '@/test/msw/server';
import { createTestQueryClient } from '@/test/query-client';
import { NotificationsTable } from './notifications-table';

// El agregador central `src/test/msw/handlers.ts` todavía no incluye este dominio (lo integra
// otro equipo), así que los handlers se registran acá con `server.use`.
beforeEach(() => {
  server.use(...notificationsHandlers);
});

function renderNotificationsTable() {
  const queryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <NotificationsTable />
    </QueryClientProvider>,
  );
}

describe('NotificationsTable', () => {
  it('muestra las notificaciones una vez cargadas', async () => {
    // Arrange & Act
    renderNotificationsTable();

    // Assert
    expect(await screen.findByText('Pago procesado')).toBeInTheDocument();
    expect(screen.getByText('Nueva solicitud de servicio')).toBeInTheDocument();
    expect(
      screen.getByText('Nueva calificación de un cliente'),
    ).toBeInTheDocument();
  });

  it('muestra "Sí" en la columna Leída para una notificación ya leída y "No" para una pendiente', async () => {
    // Arrange & Act
    renderNotificationsTable();
    await screen.findByText('Pago procesado');

    // Assert
    const rows = screen.getAllByRole('row');
    const readRow = rows.find((row) =>
      row.textContent?.includes('Nueva solicitud de servicio'),
    );
    const unreadRow = rows.find((row) =>
      row.textContent?.includes('Pago procesado'),
    );
    expect(readRow?.textContent).toContain('Sí');
    expect(unreadRow?.textContent).toContain('No');
  });

  it('solo muestra el botón "Marcar como leída" en notificaciones no leídas', async () => {
    // Arrange & Act
    renderNotificationsTable();
    await screen.findByText('Pago procesado');

    // Assert
    const rows = screen.getAllByRole('row');
    const readRow = rows.find((row) =>
      row.textContent?.includes('Nueva solicitud de servicio'),
    );
    const unreadRow = rows.find((row) =>
      row.textContent?.includes('Pago procesado'),
    );
    expect(
      unreadRow &&
        Array.from(unreadRow.querySelectorAll('button')).some(
          (button) => button.textContent === 'Marcar como leída',
        ),
    ).toBe(true);
    expect(
      readRow &&
        Array.from(readRow.querySelectorAll('button')).some(
          (button) => button.textContent === 'Marcar como leída',
        ),
    ).toBe(false);
  });

  it('marca una notificación como leída al hacer click en el botón de acción', async () => {
    // Arrange
    const user = userEvent.setup();
    const onRequest = vi.fn();
    server.use(
      http.put('/api/backend/notifications/:id/read', ({ params }) => {
        onRequest(params.id);
        return HttpResponse.json(
          Object.assign({}, fakeNotifications[0], { status: 'read' }),
        );
      }),
    );
    renderNotificationsTable();
    await screen.findByText('Pago procesado');

    // Act
    await user.click(
      screen.getAllByRole('button', { name: 'Marcar como leída' })[0],
    );

    // Assert
    await waitFor(() => {
      expect(onRequest).toHaveBeenCalledWith(fakeNotifications[0].id);
    });
  });

  it('muestra un mensaje vacío cuando el backend no devuelve notificaciones', async () => {
    // Arrange
    server.use(
      http.get('/api/backend/notifications', () => HttpResponse.json([])),
    );

    // Act
    renderNotificationsTable();

    // Assert
    expect(
      await screen.findByText('No hay notificaciones para mostrar'),
    ).toBeInTheDocument();
  });

  it('muestra un mensaje de error si la carga falla', async () => {
    // Arrange
    server.use(
      http.get('/api/backend/notifications', () =>
        HttpResponse.json({ message: 'Error interno' }, { status: 500 }),
      ),
    );

    // Act
    renderNotificationsTable();

    // Assert
    expect(
      await screen.findByText(
        'No se pudo cargar el log de notificaciones. Intentá recargar la página.',
      ),
    ).toBeInTheDocument();
  });
});
