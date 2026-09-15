import { QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@/test/render';
import userEvent from '@testing-library/user-event';
import { HttpResponse, http } from 'msw';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { buildProfessional } from '@/test/msw/handlers/professionals';
import { buildUser } from '@/test/msw/handlers/users';
import { server } from '@/test/msw/server';
import { createTestQueryClient } from '@/test/query-client';
import { GlobalSearch } from './global-search';

const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}));

function renderGlobalSearch() {
  const queryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <GlobalSearch />
    </QueryClientProvider>,
  );
}

beforeEach(() => {
  mockPush.mockClear();
  server.use(
    http.get('/api/backend/users', ({ request }) => {
      const name = new URL(request.url).searchParams.get('name');
      const data =
        name === 'ana'
          ? [buildUser({ referenceId: 'user-ana', firstName: 'Ana' })]
          : [];
      return HttpResponse.json({
        data,
        pagination: { total: data.length, page: 1, pageSize: 5, totalPages: 1 },
      });
    }),
    http.get('/api/backend/professionals', ({ request }) => {
      const search = new URL(request.url).searchParams.get('search');
      const data =
        search === 'ana'
          ? [
              buildProfessional({
                referenceId: 'prof-ana',
                user: {
                  id: 99,
                  email: 'ana.prof@example.com',
                  firstName: 'Ana',
                  lastName: 'Profesional',
                  phoneNumber: '+595991112233',
                },
              }),
            ]
          : [];
      return HttpResponse.json({
        data,
        pagination: { total: data.length, page: 1, pageSize: 5, totalPages: 1 },
      });
    }),
  );
});

describe('GlobalSearch', () => {
  it('abre el diálogo al hacer click en el ícono de búsqueda', async () => {
    // Arrange
    const user = userEvent.setup();
    renderGlobalSearch();

    // Act
    await user.click(screen.getByRole('button', { name: 'Búsqueda global' }));

    // Assert
    expect(await screen.findByText('Buscar')).toBeInTheDocument();
  });

  it('abre el diálogo con el atajo Ctrl+K', async () => {
    // Arrange
    const user = userEvent.setup();
    renderGlobalSearch();

    // Act
    await user.keyboard('{Control>}k{/Control}');

    // Assert
    expect(await screen.findByText('Buscar')).toBeInTheDocument();
  });

  it('muestra una pista si se escribe un solo carácter', async () => {
    // Arrange
    const user = userEvent.setup();
    renderGlobalSearch();
    await user.click(screen.getByRole('button', { name: 'Búsqueda global' }));

    // Act
    await user.type(screen.getByPlaceholderText('Buscar por nombre...'), 'a');

    // Assert
    expect(
      await screen.findByText('Escribí al menos 2 caracteres.'),
    ).toBeInTheDocument();
  });

  it('combina resultados de usuarios y profesionales para la misma búsqueda', async () => {
    // Arrange
    const user = userEvent.setup();
    renderGlobalSearch();
    await user.click(screen.getByRole('button', { name: 'Búsqueda global' }));

    // Act
    await user.type(screen.getByPlaceholderText('Buscar por nombre...'), 'ana');

    // Assert
    expect(
      await screen.findByText('Ana González · ana.gonzalez@example.com'),
    ).toBeInTheDocument();
    expect(screen.getByText('Ana Profesional · Plomería')).toBeInTheDocument();
  });

  it('navega al detalle y cierra el diálogo al seleccionar un resultado', async () => {
    // Arrange
    const user = userEvent.setup();
    renderGlobalSearch();
    await user.click(screen.getByRole('button', { name: 'Búsqueda global' }));
    await user.type(screen.getByPlaceholderText('Buscar por nombre...'), 'ana');
    const result = await screen.findByText(
      'Ana González · ana.gonzalez@example.com',
    );

    // Act
    await user.click(result);

    // Assert
    expect(mockPush).toHaveBeenCalledWith('/admin/users/user-ana');
    await waitFor(() => {
      expect(screen.queryByText('Buscar')).not.toBeInTheDocument();
    });
  });

  it('muestra el resto de los resultados aunque una de las dos búsquedas falle', async () => {
    // Arrange
    server.use(
      http.get('/api/backend/users', () =>
        HttpResponse.json({ message: 'Sin permiso' }, { status: 403 }),
      ),
    );
    const user = userEvent.setup();
    renderGlobalSearch();
    await user.click(screen.getByRole('button', { name: 'Búsqueda global' }));

    // Act
    await user.type(screen.getByPlaceholderText('Buscar por nombre...'), 'ana');

    // Assert: el resultado de profesionales sigue apareciendo
    expect(
      await screen.findByText('Ana Profesional · Plomería'),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'No se pudo completar una de las búsquedas (puede faltar un permiso) — se muestran los resultados disponibles.',
      ),
    ).toBeInTheDocument();
  });

  it('muestra un estado vacío explícito cuando ninguna búsqueda encuentra resultados', async () => {
    // Arrange
    const user = userEvent.setup();
    renderGlobalSearch();
    await user.click(screen.getByRole('button', { name: 'Búsqueda global' }));

    // Act
    await user.type(
      screen.getByPlaceholderText('Buscar por nombre...'),
      'inexistente',
    );

    // Assert
    expect(
      await screen.findByText('Sin resultados para "inexistente".'),
    ).toBeInTheDocument();
  });
});
