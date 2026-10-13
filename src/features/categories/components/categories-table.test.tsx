import { QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor, within } from '@/test/render';
import userEvent from '@testing-library/user-event';
import { HttpResponse, http } from 'msw';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  categoriesHandlers,
  fakeCategories,
} from '@/test/msw/handlers/categories';
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

  it('pide cada pagina al backend con page/pageSize y navega con los controles de paginacion (DEF-WEB-002)', async () => {
    // Arrange
    const user = userEvent.setup();
    const requested: string[] = [];
    server.use(
      http.get('/api/backend/categories/all', ({ request }) => {
        const params = new URL(request.url).searchParams;
        requested.push(`${params.get('page')}:${params.get('pageSize')}`);
        const page = Number(params.get('page'));
        return HttpResponse.json({
          data: [
            {
              ...fakeCategories[0],
              id: page,
              name: `Categoría pagina ${page}`,
            },
          ],
          pagination: { total: 25, page, pageSize: 10, totalPages: 3 },
        });
      }),
    );
    renderCategoriesTable();
    expect(await screen.findByText('Categoría pagina 1')).toBeInTheDocument();
    expect(requested).toEqual(['1:10']);

    // Act
    await user.click(screen.getByRole('button', { name: 'Página siguiente' }));

    // Assert
    expect(await screen.findByText('Categoría pagina 2')).toBeInTheDocument();
    expect(requested).toContain('2:10');
    expect(screen.getByText('Página 2 de 3')).toBeInTheDocument();
  });

  it('muestra un mensaje vacío cuando el backend no devuelve categorías', async () => {
    // Arrange
    server.use(
      http.get('/api/backend/categories/all', () =>
        HttpResponse.json({
          data: [],
          pagination: { total: 0, page: 1, pageSize: 10, totalPages: 0 },
        }),
      ),
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

  it('elimina en bloque las categorías seleccionadas cuando todas las llamadas tienen éxito', async () => {
    // Arrange
    const user = userEvent.setup();
    const deletedIds: string[] = [];
    server.use(
      http.delete('/api/backend/categories/:id', ({ params }) => {
        deletedIds.push(String(params.id));
        return new HttpResponse(null, { status: 204 });
      }),
    );
    renderCategoriesTable();
    await screen.findByText('Plomería');

    // Act
    const rowCheckboxes = screen.getAllByRole('checkbox', {
      name: 'Seleccionar fila',
    });
    await user.click(rowCheckboxes[0]);
    await user.click(rowCheckboxes[1]);
    await user.click(
      screen.getByRole('button', { name: 'Eliminar seleccionadas (2)' }),
    );
    const dialog = await screen.findByRole('alertdialog');
    await user.click(within(dialog).getByRole('button', { name: 'Eliminar' }));

    // Assert
    await waitFor(() => {
      expect(deletedIds.sort()).toEqual(['1', '2']);
    });
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
  });

  it('reporta el fallo parcial y no bloquea el resto cuando algunas eliminaciones fallan', async () => {
    // Arrange
    const user = userEvent.setup();
    server.use(
      http.delete('/api/backend/categories/:id', ({ params }) => {
        if (String(params.id) === '2') {
          return HttpResponse.json(
            { message: 'No autorizado' },
            { status: 403 },
          );
        }
        return new HttpResponse(null, { status: 204 });
      }),
    );
    renderCategoriesTable();
    await screen.findByText('Plomería');

    // Act
    const rowCheckboxes = screen.getAllByRole('checkbox', {
      name: 'Seleccionar fila',
    });
    await user.click(rowCheckboxes[0]);
    await user.click(rowCheckboxes[1]);
    await user.click(
      screen.getByRole('button', { name: 'Eliminar seleccionadas (2)' }),
    );
    const dialog = await screen.findByRole('alertdialog');
    await user.click(within(dialog).getByRole('button', { name: 'Eliminar' }));

    // Assert: el diálogo se cierra y la selección se limpia pese al fallo parcial
    await waitFor(() => {
      expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
    });
    expect(
      screen.getAllByRole('checkbox', { name: 'Seleccionar fila' })[0],
    ).not.toBeChecked();
  });
});
