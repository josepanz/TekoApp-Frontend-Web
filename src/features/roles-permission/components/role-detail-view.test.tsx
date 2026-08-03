import { QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@/test/render';
import { beforeEach, describe, expect, it } from 'vitest';
import { rolesHandlers } from '@/test/msw/handlers/roles';
import { server } from '@/test/msw/server';
import { createTestQueryClient } from '@/test/query-client';
import { RoleDetailView } from './role-detail-view';

beforeEach(() => {
  server.use(...rolesHandlers);
});

function renderDetailView(id: number) {
  const queryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <RoleDetailView id={id} />
    </QueryClientProvider>,
  );
}

describe('RoleDetailView', () => {
  it('muestra el rol con sus permisos asignados una vez cargado', async () => {
    // Arrange & Act
    renderDetailView(1);

    // Assert
    expect(
      await screen.findByText(
        'Administrador de comercio',
        {},
        { timeout: 3000 },
      ),
    ).toBeInTheDocument();
    expect(screen.getByText('Leer clientes')).toBeInTheDocument();
    expect(screen.getByText('1 permisos')).toBeInTheDocument();
  });

  it('muestra un mensaje de error si el rol no existe', async () => {
    // Arrange & Act
    renderDetailView(999);

    // Assert
    expect(
      await screen.findByText(
        'No se pudo cargar el rol.',
        {},
        { timeout: 3000 },
      ),
    ).toBeInTheDocument();
  });
});
