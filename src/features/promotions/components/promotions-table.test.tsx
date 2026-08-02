import { QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor, within } from '@/test/render';
import userEvent from '@testing-library/user-event';
import { HttpResponse, http } from 'msw';
import { beforeEach, describe, expect, it } from 'vitest';
import { promotionsHandlers } from '@/test/msw/handlers/promotions';
import { server } from '@/test/msw/server';
import { createTestQueryClient } from '@/test/query-client';
import { PromotionsTable } from './promotions-table';

// El agregador central `src/test/msw/handlers.ts` todavía no incluye este dominio (lo integra
// otro equipo), así que los handlers se registran acá con `server.use`.
beforeEach(() => {
  server.use(...promotionsHandlers);
});

function renderPromotionsTable() {
  const queryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <PromotionsTable />
    </QueryClientProvider>,
  );
}

describe('PromotionsTable', () => {
  it('muestra las filas de promociones una vez cargadas', async () => {
    // Arrange & Act
    renderPromotionsTable();

    // Assert
    expect(await screen.findByText('PROMO2025')).toBeInTheDocument();
    expect(screen.getByText('Descuento de verano')).toBeInTheDocument();
    expect(screen.getByText('BIENVENIDA10')).toBeInTheDocument();
    expect(screen.getByText('Bienvenida nuevos clientes')).toBeInTheDocument();
    expect(screen.getAllByText('Activa')).toHaveLength(2);
    expect(screen.getByText('Porcentaje · 20%')).toBeInTheDocument();
  });

  it('muestra un mensaje vacío cuando el backend no devuelve promociones', async () => {
    // Arrange
    server.use(
      http.get('/api/backend/promotions', () => HttpResponse.json([])),
    );

    // Act
    renderPromotionsTable();

    // Assert
    expect(
      await screen.findByText('No hay promociones para mostrar'),
    ).toBeInTheDocument();
  });

  it('muestra un mensaje de error si la carga falla', async () => {
    // Arrange
    server.use(
      http.get('/api/backend/promotions', () =>
        HttpResponse.json({ message: 'Error interno' }, { status: 500 }),
      ),
    );

    // Act
    renderPromotionsTable();

    // Assert
    expect(
      await screen.findByText(
        'No se pudo cargar la lista de promociones. Intentá recargar la página.',
      ),
    ).toBeInTheDocument();
  });

  it('cierra el diálogo de confirmación al desactivar una promoción', async () => {
    // Arrange
    const user = userEvent.setup();
    renderPromotionsTable();
    await screen.findByText('PROMO2025');
    const rows = screen.getAllByRole('row');
    const promoRow = rows.find((row) => row.textContent?.includes('PROMO2025'));
    expect(promoRow).toBeDefined();

    // Act
    await user.click(
      within(promoRow!).getByRole('button', { name: 'Eliminar' }),
    );
    expect(
      await screen.findByText('¿Desactivar esta promoción?'),
    ).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Desactivar' }));

    // Assert
    await waitFor(() =>
      expect(
        screen.queryByText('¿Desactivar esta promoción?'),
      ).not.toBeInTheDocument(),
    );
  });
});
