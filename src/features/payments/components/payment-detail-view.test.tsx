import { QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@/test/render';
import { beforeEach, describe, expect, it } from 'vitest';
import { paymentsHandlers } from '@/test/msw/handlers/payments';
import { server } from '@/test/msw/server';
import { createTestQueryClient } from '@/test/query-client';
import { PaymentDetailView } from './payment-detail-view';

beforeEach(() => {
  server.use(...paymentsHandlers);
});

function renderDetailView(id: string) {
  const queryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <PaymentDetailView id={id} />
    </QueryClientProvider>,
  );
}

describe('PaymentDetailView', () => {
  it('muestra los datos del pago una vez cargado', async () => {
    // Arrange & Act
    renderDetailView('f47ac10b-58cc-4372-a567-0e02b2c3d479');

    // Assert
    expect(
      await screen.findByText('Pago txn-uuid-abc', {}, { timeout: 3000 }),
    ).toBeInTheDocument();
    expect(screen.getByText('#1', { exact: false })).toBeInTheDocument();
    expect(screen.getByText('#5', { exact: false })).toBeInTheDocument();
    expect(screen.getByText('CREDIT_CARD')).toBeInTheDocument();
    expect(screen.getByText('STRIPE')).toBeInTheDocument();
    expect(screen.getByText('Pagado')).toBeInTheDocument();
  });

  it('muestra un mensaje de error si el pago no existe', async () => {
    // Arrange & Act
    renderDetailView('id-inexistente');

    // Assert
    expect(
      await screen.findByText(
        'No se pudo cargar el detalle de este pago.',
        {},
        { timeout: 3000 },
      ),
    ).toBeInTheDocument();
  });
});
