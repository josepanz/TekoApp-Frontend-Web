import { QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@/test/render';
import { beforeEach, describe, expect, it } from 'vitest';
import { categoriesHandlers } from '@/test/msw/handlers/categories';
import { server } from '@/test/msw/server';
import { createTestQueryClient } from '@/test/query-client';
import { CategoryDetailView } from './category-detail-view';

beforeEach(() => {
  server.use(...categoriesHandlers);
});

function renderDetailView(id: string) {
  const queryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <CategoryDetailView id={id} />
    </QueryClientProvider>,
  );
}

describe('CategoryDetailView', () => {
  it('muestra los datos de la categoría una vez cargada', async () => {
    // Arrange & Act
    renderDetailView('1');

    // Assert
    expect(
      await screen.findByText('Plomería', {}, { timeout: 3000 }),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Servicios de reparación e instalaciones sanitarias'),
    ).toBeInTheDocument();
    expect(screen.getByText('wrench-outline')).toBeInTheDocument();
    expect(screen.getByText('12 profesionales')).toBeInTheDocument();
    expect(screen.getByText('34 servicios')).toBeInTheDocument();
  });

  it('muestra un mensaje de error si la categoría no existe', async () => {
    // Arrange & Act
    renderDetailView('999');

    // Assert
    expect(
      await screen.findByText(
        'No se pudo cargar el detalle de esta categoría.',
        {},
        { timeout: 3000 },
      ),
    ).toBeInTheDocument();
  });
});
