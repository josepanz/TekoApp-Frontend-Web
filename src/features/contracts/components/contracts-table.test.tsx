import { QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@/test/render';
import { HttpResponse, http } from 'msw';
import { beforeEach, describe, expect, it } from 'vitest';
import { contractsHandlers } from '@/test/msw/handlers/contracts';
import { server } from '@/test/msw/server';
import { createTestQueryClient } from '@/test/query-client';
import { ContractsTable } from './contracts-table';

function mockScope(permissions: string[]) {
  server.use(
    http.get('/api/backend/auth/scope', () => {
      return HttpResponse.json({
        permissions: permissions.map((name) => ({ name })),
        roles: [],
      });
    }),
  );
}

beforeEach(() => {
  server.use(...contractsHandlers);
  mockScope(['admin:all']);
});

function renderTable() {
  const queryClient = createTestQueryClient();
  render(
    <QueryClientProvider client={queryClient}>
      <ContractsTable />
    </QueryClientProvider>,
  );
  return queryClient;
}

describe('ContractsTable', () => {
  it('no renderiza nada si el usuario no tiene permiso de auditoría', async () => {
    // Arrange
    mockScope([]);

    // Act
    const queryClient = renderTable();

    // Assert
    await waitFor(() =>
      expect(queryClient.getQueryState(['auth', 'scope'])?.status).toBe(
        'success',
      ),
    );
    expect(screen.queryByText('contract-1')).not.toBeInTheDocument();
  });

  it('muestra las filas de contratos una vez cargadas', async () => {
    // Arrange & Act
    renderTable();

    // Assert
    expect(await screen.findByText('contract-1')).toBeInTheDocument();
    expect(screen.getByText('Firmado')).toBeInTheDocument();
    expect(screen.getByText('#client-1')).toBeInTheDocument();
    expect(screen.getByText('#prof-1')).toBeInTheDocument();
  });

  it('muestra un mensaje vacío cuando el backend no devuelve contratos', async () => {
    // Arrange
    server.use(
      http.get('/api/backend/admin/contracts', () =>
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
        'No hay contratos que coincidan con los filtros.',
      ),
    ).toBeInTheDocument();
  });

  it('muestra un mensaje de error si la carga falla', async () => {
    // Arrange
    server.use(
      http.get('/api/backend/admin/contracts', () =>
        HttpResponse.json({ message: 'Error interno' }, { status: 500 }),
      ),
    );

    // Act
    renderTable();

    // Assert
    expect(
      await screen.findByText('No se pudo cargar la lista de contratos.'),
    ).toBeInTheDocument();
  });
});
