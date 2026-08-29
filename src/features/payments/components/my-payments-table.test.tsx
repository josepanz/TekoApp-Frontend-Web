import { QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@/test/render';
import userEvent from '@testing-library/user-event';
import { HttpResponse, http } from 'msw';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { buildPayment, paymentsHandlers } from '@/test/msw/handlers/payments';
import { server } from '@/test/msw/server';
import { createTestQueryClient } from '@/test/query-client';
import { formatCurrency } from '@/lib/formatters';
import { MyPaymentsTable } from './my-payments-table';

beforeEach(() => {
  server.use(...paymentsHandlers);
});

function renderMyPaymentsTable() {
  const queryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <MyPaymentsTable />
    </QueryClientProvider>,
  );
}

describe('MyPaymentsTable', () => {
  it('muestra solo los pagos propios del usuario autenticado', async () => {
    // Arrange & Act
    renderMyPaymentsTable();

    // Assert — el fixture de /payments/me filtra por userId: 1, solo txn-uuid-abc califica.
    expect(await screen.findByText('txn-uuid-abc')).toBeInTheDocument();
    expect(screen.queryByText('txn-uuid-pending')).not.toBeInTheDocument();
    expect(screen.queryByText('txn-uuid-cancelled')).not.toBeInTheDocument();
  });

  it('nunca muestra la acción de reembolsar, solo cancelar cuando el pago está pendiente', async () => {
    // Arrange
    server.use(
      http.get('/api/backend/payments/me', () =>
        HttpResponse.json([
          buildPayment({ status: 'PENDING' }),
          buildPayment({
            id: 2,
            referenceId: 'pay-uuid-paid',
            transactionId: 'txn-uuid-paid',
            status: 'PAID',
          }),
        ]),
      ),
    );

    // Act
    renderMyPaymentsTable();
    await screen.findByText('txn-uuid-paid');

    // Assert
    expect(
      screen.queryByRole('button', { name: 'Reembolsar' }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Cancelar' }),
    ).toBeInTheDocument();
  });

  it('muestra un mensaje vacío cuando no tenés pagos', async () => {
    // Arrange
    server.use(
      http.get('/api/backend/payments/me', () => HttpResponse.json([])),
    );

    // Act
    renderMyPaymentsTable();

    // Assert
    expect(
      await screen.findByText('Todavía no tenés pagos'),
    ).toBeInTheDocument();
  });

  it('muestra un mensaje de error si la carga falla', async () => {
    // Arrange
    server.use(
      http.get('/api/backend/payments/me', () =>
        HttpResponse.json({ message: 'Error interno' }, { status: 500 }),
      ),
    );

    // Act
    renderMyPaymentsTable();

    // Assert
    expect(
      await screen.findByText(
        'No se pudo cargar tus pagos. Intentá recargar la página.',
      ),
    ).toBeInTheDocument();
  });

  it('dispara la mutación de cancelación al confirmar', async () => {
    // Arrange
    const user = userEvent.setup();
    const onRequest = vi.fn();
    server.use(
      http.get('/api/backend/payments/me', () =>
        HttpResponse.json([buildPayment({ status: 'PENDING' })]),
      ),
      http.post('/api/backend/payments/:id/cancel', ({ params }) => {
        onRequest(params.id);
        return HttpResponse.json({ status: 'CANCELLED' });
      }),
    );
    renderMyPaymentsTable();
    await screen.findByText('txn-uuid-abc');

    // Act
    await user.click(screen.getByRole('button', { name: 'Cancelar' }));
    await user.click(
      await screen.findByRole('button', { name: 'Sí, cancelar' }),
    );

    // Assert
    await waitFor(() => {
      expect(onRequest).toHaveBeenCalledWith(
        'f47ac10b-58cc-4372-a567-0e02b2c3d479',
      );
    });
  });

  it('muestra el ícono de propina cuando el pago tiene una', async () => {
    // Arrange
    server.use(
      http.get('/api/backend/payments/me', () =>
        HttpResponse.json([
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
        ]),
      ),
    );

    // Act
    renderMyPaymentsTable();

    // Assert
    expect(
      await screen.findByRole('img', {
        name: `Propina: ${formatCurrency(15000, 'PYG')}`,
      }),
    ).toBeInTheDocument();
  });
});
