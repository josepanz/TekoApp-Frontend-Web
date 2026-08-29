import { QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@/test/render';
import userEvent from '@testing-library/user-event';
import { HttpResponse, http } from 'msw';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { categoriesHandlers } from '@/test/msw/handlers/categories';
import { materialCatalogHandlers } from '@/test/msw/handlers/material-catalog';
import { server } from '@/test/msw/server';
import { createTestQueryClient } from '@/test/query-client';
import { MaterialCatalogTable } from './material-catalog-table';

beforeEach(() => {
  server.use(...categoriesHandlers, ...materialCatalogHandlers);
});

function renderTable() {
  const queryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <MaterialCatalogTable />
    </QueryClientProvider>,
  );
}

describe('MaterialCatalogTable', () => {
  it('muestra las filas del catálogo una vez cargadas', async () => {
    // Arrange & Act
    renderTable();

    // Assert
    expect(
      await screen.findByText('Cerámica esmaltada 30x30'),
    ).toBeInTheDocument();
    expect(screen.getByText('Estándar')).toBeInTheDocument();
  });

  it('muestra un mensaje vacío cuando no hay materiales configurados', async () => {
    // Arrange
    server.use(
      http.get('/api/backend/material-catalog', () =>
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
      await screen.findByText('Todavía no hay materiales configurados.'),
    ).toBeInTheDocument();
  });

  it('permite activar/desactivar un ítem desde el switch', async () => {
    // Arrange
    const user = userEvent.setup();
    const onRequest = vi.fn();
    server.use(
      http.patch(
        '/api/backend/admin/material-catalog/:referenceId',
        async ({ params, request }) => {
          const body = (await request.json()) as { isActive?: boolean };
          onRequest(params.referenceId, body.isActive);
          return HttpResponse.json({
            referenceId: params.referenceId,
            categoryId: 1,
            countryId: undefined,
            name: 'Cerámica esmaltada 30x30',
            unit: 'm2',
            qualityTier: 'STANDARD',
            defaultPrice: 45000,
            isActive: false,
          });
        },
      ),
    );
    renderTable();
    await screen.findByText('Cerámica esmaltada 30x30');

    // Act
    await user.click(
      screen.getByRole('switch', {
        name: 'Desactivar Cerámica esmaltada 30x30',
      }),
    );

    // Assert
    await waitFor(() => {
      expect(onRequest).toHaveBeenCalledWith('item-1', false);
    });
  });

  it('muestra un mensaje de error si la carga falla', async () => {
    // Arrange
    server.use(
      http.get('/api/backend/material-catalog', () =>
        HttpResponse.json({ message: 'Error interno' }, { status: 500 }),
      ),
    );

    // Act
    renderTable();

    // Assert
    expect(
      await screen.findByText('No se pudo cargar el catálogo.'),
    ).toBeInTheDocument();
  });
});
