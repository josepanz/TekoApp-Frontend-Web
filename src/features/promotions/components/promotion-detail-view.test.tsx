import { QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@/test/render';
import { beforeEach, describe, expect, it } from 'vitest';
import { promotionsHandlers } from '@/test/msw/handlers/promotions';
import { server } from '@/test/msw/server';
import { createTestQueryClient } from '@/test/query-client';
import { PromotionDetailView } from './promotion-detail-view';

beforeEach(() => {
  server.use(...promotionsHandlers);
});

function renderDetailView(id: string) {
  const queryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <PromotionDetailView id={id} />
    </QueryClientProvider>,
  );
}

describe('PromotionDetailView', () => {
  it('muestra los datos de la promoción una vez cargada', async () => {
    // Arrange & Act
    renderDetailView('a63b5212-db5e-4ef5-9614-726614174000');

    // Assert
    expect(
      await screen.findByText('Descuento de verano', {}, { timeout: 3000 }),
    ).toBeInTheDocument();
    expect(screen.getByText('PROMO2025')).toBeInTheDocument();
    expect(
      screen.getByText('20% de descuento en todos los servicios'),
    ).toBeInTheDocument();
    expect(screen.getByText('cliente')).toBeInTheDocument();
    expect(screen.getByText('profesional')).toBeInTheDocument();
  });

  it('muestra un mensaje de error si la promoción no existe', async () => {
    // Arrange & Act
    renderDetailView('id-inexistente');

    // Assert
    expect(
      await screen.findByText(
        'No se pudo cargar el detalle de esta promoción.',
        {},
        { timeout: 3000 },
      ),
    ).toBeInTheDocument();
  });
});
