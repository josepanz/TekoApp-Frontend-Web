import { QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@/test/render';
import userEvent from '@testing-library/user-event';
import { HttpResponse, http } from 'msw';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { buildPayment, paymentsHandlers } from '@/test/msw/handlers/payments';
import { server } from '@/test/msw/server';
import { createTestQueryClient } from '@/test/query-client';
import { MyPaymentDetailView } from './my-payment-detail-view';

beforeEach(() => {
  server.use(...paymentsHandlers);
});

function renderDetailView(id: string) {
  const queryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <MyPaymentDetailView id={id} />
    </QueryClientProvider>,
  );
}

describe('MyPaymentDetailView', () => {
  it('muestra los datos del pago propio una vez cargado, sin IDs internos ni acción de reembolso', async () => {
    // Arrange & Act
    renderDetailView('f47ac10b-58cc-4372-a567-0e02b2c3d479');

    // Assert
    expect(
      await screen.findByText('Pago txn-uuid-abc', {}, { timeout: 3000 }),
    ).toBeInTheDocument();
    expect(screen.getByText('CREDIT_CARD')).toBeInTheDocument();
    expect(screen.getByText('Pagado')).toBeInTheDocument();
    expect(screen.queryByText('#1', { exact: false })).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Reembolsar' }),
    ).not.toBeInTheDocument();
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

  it('ofrece dejar propina cuando el pago está cobrado y todavía no tiene una', async () => {
    // Arrange & Act
    renderDetailView('f47ac10b-58cc-4372-a567-0e02b2c3d479');

    // Assert
    expect(
      await screen.findByRole('button', { name: 'Dejar propina' }),
    ).toBeInTheDocument();
  });

  it('no ofrece dejar propina cuando el pago ya tiene una', async () => {
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
    await screen.findByText('Pago txn-uuid-abc');

    // Assert
    expect(
      screen.queryByRole('button', { name: 'Dejar propina' }),
    ).not.toBeInTheDocument();
    expect(screen.getByText('Propina:', { exact: false })).toBeInTheDocument();
  });

  it('no ofrece dejar propina cuando el pago está pendiente, pero sí cancelar', async () => {
    // Arrange
    server.use(
      http.get('/api/backend/payments/:id', () =>
        HttpResponse.json(buildPayment({ status: 'PENDING' })),
      ),
    );

    // Act
    renderDetailView('f47ac10b-58cc-4372-a567-0e02b2c3d479');
    await screen.findByText('Pago txn-uuid-abc');

    // Assert
    expect(
      screen.queryByRole('button', { name: 'Dejar propina' }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Cancelar' }),
    ).toBeInTheDocument();
  });

  it('dispara la mutación de propina con el porcentaje elegido al confirmar', async () => {
    // Arrange
    const user = userEvent.setup();
    const onRequest = vi.fn();
    server.use(
      http.post(
        '/api/backend/payments/:id/tip',
        async ({ params, request }) => {
          const body = await request.json();
          onRequest(params.id, body);
          return HttpResponse.json({
            referenceId: 'tip-uuid-new',
            mode: 'PERCENTAGE',
            percentage: 15,
            amount: 27991.8,
            currencyCode: 'PYG',
            createdAt: '2026-08-28T12:00:00Z',
          });
        },
      ),
    );
    renderDetailView('f47ac10b-58cc-4372-a567-0e02b2c3d479');
    await screen.findByText('Pago txn-uuid-abc');

    // Act
    await user.click(screen.getByRole('button', { name: 'Dejar propina' }));
    await user.click(await screen.findByRole('button', { name: '15%' }));
    await user.click(
      await screen.findByRole('button', { name: 'Confirmar propina' }),
    );

    // Assert
    await waitFor(() => {
      expect(onRequest).toHaveBeenCalledWith(
        'f47ac10b-58cc-4372-a567-0e02b2c3d479',
        { mode: 'PERCENTAGE', percentage: 15 },
      );
    });
  });
});
