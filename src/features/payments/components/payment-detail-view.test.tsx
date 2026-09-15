import { QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@/test/render';
import { HttpResponse, http } from 'msw';
import { beforeEach, describe, expect, it } from 'vitest';
import { buildPayment, paymentsHandlers } from '@/test/msw/handlers/payments';
import { server } from '@/test/msw/server';
import { createTestQueryClient } from '@/test/query-client';
import { PaymentDetailView } from './payment-detail-view';

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
  server.use(...paymentsHandlers);
  mockScope(['admin:all']);
});

function renderDetailView(id: string) {
  const queryClient = createTestQueryClient();
  render(
    <QueryClientProvider client={queryClient}>
      <PaymentDetailView id={id} />
    </QueryClientProvider>,
  );
  return queryClient;
}

describe('PaymentDetailView', () => {
  it('no renderiza nada si el usuario no tiene permiso de auditoría', async () => {
    // Arrange
    mockScope([]);

    // Act
    const queryClient = renderDetailView(
      'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    );

    // Assert
    await waitFor(() =>
      expect(queryClient.getQueryState(['auth', 'scope'])?.status).toBe(
        'success',
      ),
    );
    expect(screen.queryByText('Pago txn-uuid-abc')).not.toBeInTheDocument();
  });

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

  it('muestra el monto de la propina cuando el pago tiene una', async () => {
    // Arrange
    server.use(
      http.get('/api/backend/payments/:id', () =>
        HttpResponse.json(
          buildPayment({
            tip: {
              referenceId: 'tip-uuid-1',
              mode: 'PERCENTAGE',
              percentage: 10,
              amount: 15000,
              currencyCode: 'PYG',
              createdAt: '2026-06-17T14:00:00Z',
            },
          }),
        ),
      ),
    );

    // Act
    renderDetailView('f47ac10b-58cc-4372-a567-0e02b2c3d479');

    // Assert
    expect(
      await screen.findByText('Propina:', { exact: false }),
    ).toBeInTheDocument();
  });
});
