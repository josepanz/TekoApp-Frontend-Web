import { QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@/test/render';
import userEvent from '@testing-library/user-event';
import { HttpResponse, http } from 'msw';
import { describe, expect, it } from 'vitest';
import { server } from '@/test/msw/server';
import { createTestQueryClient } from '@/test/query-client';
import { UsersTable } from './users-table';

function renderUsersTable() {
  const queryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <UsersTable />
    </QueryClientProvider>,
  );
}

describe('UsersTable', () => {
  it('muestra las filas de usuarios una vez cargadas', async () => {
    // Arrange & Act
    renderUsersTable();

    // Assert
    expect(
      await screen.findByText('ana.gonzalez@example.com'),
    ).toBeInTheDocument();
    expect(screen.getByText('Carlos Benítez')).toBeInTheDocument();
    expect(screen.getByText('Activo')).toBeInTheDocument();
    expect(screen.getByText('Verificación pendiente')).toBeInTheDocument();
  });

  it("avanza de página al hacer click en 'Página siguiente'", async () => {
    // Arrange
    const user = userEvent.setup();
    renderUsersTable();
    await screen.findByText('ana.gonzalez@example.com');

    // Act
    await user.click(screen.getByRole('button', { name: 'Página siguiente' }));

    // Assert
    expect(await screen.findByText('Página 2 de 2')).toBeInTheDocument();
  });

  it('muestra un mensaje vacío cuando el backend no devuelve usuarios', async () => {
    // Arrange
    server.use(
      http.get('/api/backend/users', () =>
        HttpResponse.json({
          data: [],
          pagination: { total: 0, page: 1, pageSize: 10, totalPages: 1 },
        }),
      ),
    );

    // Act
    renderUsersTable();

    // Assert
    expect(
      await screen.findByText('No hay usuarios para mostrar'),
    ).toBeInTheDocument();
  });

  it('muestra un mensaje de error si la carga falla', async () => {
    // Arrange
    server.use(
      http.get('/api/backend/users', () =>
        HttpResponse.json({ message: 'Error interno' }, { status: 500 }),
      ),
    );

    // Act
    renderUsersTable();

    // Assert
    expect(
      await screen.findByText(
        'No se pudo cargar la lista de usuarios. Intentá recargar la página.',
      ),
    ).toBeInTheDocument();
  });
});
