import { QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HttpResponse, http } from 'msw';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { categoriesHandlers } from '@/test/msw/handlers/categories';
import { server } from '@/test/msw/server';
import { createTestQueryClient } from '@/test/query-client';
import { CategoriesTable } from './categories-table';

// El agregador central `src/test/msw/handlers.ts` todavía no incluye este dominio (lo integra
// otro equipo), así que los handlers se registran acá con `server.use`.
beforeEach(() => {
  server.use(...categoriesHandlers);
});

function renderCategoriesTable() {
  const queryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <CategoriesTable />
    </QueryClientProvider>,
  );
}

describe('CategoriesTable', () => {
  it('muestra las filas de categorías una vez cargadas', async () => {
    // Arrange & Act
    renderCategoriesTable();

    // Assert
    expect(await screen.findByText('Plomería')).toBeInTheDocument();
    expect(screen.getByText('electricidad')).toBeInTheDocument();
    expect(screen.getByText('Jardinería')).toBeInTheDocument();
    expect(screen.getByText('wrench-outline')).toBeInTheDocument();
  });

  it('permite alternar la visibilidad de una categoría desde el switch', async () => {
    // Arrange
    const user = userEvent.setup();
    const onRequest = vi.fn();
    server.use(
      http.patch(
        '/api/backend/categories/:id/toggle-visibility',
        ({ params }) => {
          onRequest(params.id);
          return HttpResponse.json({
            id: 1,
            name: 'Plomería',
            slug: 'plomeria',
            description: null,
            icon: null,
            color: null,
            sortOrder: 0,
            status: 'ACTIVE',
            isVisible: false,
            requiresVerification: false,
            metadata: null,
            parentCategoryId: null,
            createdAt: '2026-05-01T10:00:00Z',
            lastChangedAt: null,
          });
        },
      ),
    );
    renderCategoriesTable();
    await screen.findByText('Plomería');

    // Act
    await user.click(screen.getByRole('switch', { name: 'Ocultar Plomería' }));

    // Assert
    await waitFor(() => {
      expect(onRequest).toHaveBeenCalledWith('1');
    });
  });

  it('muestra un mensaje vacío cuando el backend no devuelve categorías', async () => {
    // Arrange
    server.use(
      http.get('/api/backend/categories/all', () => HttpResponse.json([])),
    );

    // Act
    renderCategoriesTable();

    // Assert
    expect(
      await screen.findByText('No hay categorías para mostrar'),
    ).toBeInTheDocument();
  });

  it('muestra un mensaje de error si la carga falla', async () => {
    // Arrange
    server.use(
      http.get('/api/backend/categories/all', () =>
        HttpResponse.json({ message: 'Error interno' }, { status: 500 }),
      ),
    );

    // Act
    renderCategoriesTable();

    // Assert
    expect(
      await screen.findByText(
        'No se pudo cargar la lista de categorías. Intentá recargar la página.',
      ),
    ).toBeInTheDocument();
  });
});
