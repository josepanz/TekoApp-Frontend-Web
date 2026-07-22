import { QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { HttpResponse, http } from 'msw';
import { beforeEach, describe, expect, it } from 'vitest';
import { server } from '@/test/msw/server';
import { rolesHandlers } from '@/test/msw/handlers/roles';
import { createTestQueryClient } from '@/test/query-client';
import { RolesTable } from './roles-table';

function renderRolesTable() {
  const queryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <RolesTable />
    </QueryClientProvider>,
  );
}

describe('RolesTable', () => {
  beforeEach(() => {
    server.use(...rolesHandlers);
  });

  it('muestra las filas de roles una vez cargadas', async () => {
    // Arrange & Act
    renderRolesTable();

    // Assert
    expect(await screen.findByText('MerchantAdmin')).toBeInTheDocument();
    expect(screen.getByText('SupportAgent')).toBeInTheDocument();
    expect(screen.getByText('Activo')).toBeInTheDocument();
    expect(screen.getByText('Inactivo')).toBeInTheDocument();
  });

  it('muestra un mensaje vacío cuando el backend no devuelve roles', async () => {
    // Arrange
    server.use(
      http.get('/api/backend/roles', () =>
        HttpResponse.json({ roles: [], total: 0, active: 0, inactive: 0 }),
      ),
    );

    // Act
    renderRolesTable();

    // Assert
    expect(
      await screen.findByText('No hay roles para mostrar'),
    ).toBeInTheDocument();
  });

  it('muestra un mensaje de error si la carga falla', async () => {
    // Arrange
    server.use(
      http.get('/api/backend/roles', () =>
        HttpResponse.json({ message: 'Error interno' }, { status: 500 }),
      ),
    );

    // Act
    renderRolesTable();

    // Assert
    expect(
      await screen.findByText(
        'No se pudo cargar la lista de roles. Intentá recargar la página.',
      ),
    ).toBeInTheDocument();
  });
});
