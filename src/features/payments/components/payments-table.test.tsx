import { QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@/test/render';
import userEvent from '@testing-library/user-event';
import { HttpResponse, http } from 'msw';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { buildPayment, paymentsHandlers } from '@/test/msw/handlers/payments';
import { server } from '@/test/msw/server';
import { createTestQueryClient } from '@/test/query-client';
import { formatCurrency } from '@/lib/formatters';
import { PaymentsTable } from './payments-table';

// El agregador central `src/test/msw/handlers.ts` todavía no incluye este dominio (lo integra
// otro equipo), así que los handlers se registran acá con `server.use`.
beforeEach(() => {
  server.use(...paymentsHandlers);
});

function renderPaymentsTable() {
  const queryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <PaymentsTable />
    </QueryClientProvider>,
  );
}

describe('PaymentsTable', () => {
  it('muestra las filas de pagos una vez cargadas', async () => {
    // Arrange & Act
    renderPaymentsTable();

    // Assert
    expect(await screen.findByText('txn-uuid-abc')).toBeInTheDocument();
    expect(screen.getByText('txn-uuid-pending')).toBeInTheDocument();
    expect(screen.getByText('txn-uuid-cancelled')).toBeInTheDocument();
    expect(screen.getByText('Pagado')).toBeInTheDocument();
    expect(screen.getByText('Pendiente')).toBeInTheDocument();
    expect(screen.getByText('Cancelado')).toBeInTheDocument();
  });

  it('muestra la acción de reembolsar solo para pagos ya cobrados y cancelar solo para pendientes', async () => {
    // Arrange & Act
    renderPaymentsTable();
    await screen.findByText('txn-uuid-abc');

    // Assert
    const rows = screen.getAllByRole('row');
    const paidRow = rows.find((row) =>
      row.textContent?.includes('txn-uuid-abc'),
    );
    const pendingRow = rows.find((row) =>
      row.textContent?.includes('txn-uuid-pending'),
    );
    const cancelledRow = rows.find((row) =>
      row.textContent?.includes('txn-uuid-cancelled'),
    );

    expect(
      paidRow &&
        Array.from(paidRow.querySelectorAll('button')).some(
          (button) => button.textContent === 'Reembolsar',
        ),
    ).toBe(true);
    expect(
      pendingRow &&
        Array.from(pendingRow.querySelectorAll('button')).some(
          (button) => button.textContent === 'Cancelar',
        ),
    ).toBe(true);
    expect(
      cancelledRow &&
        Array.from(cancelledRow.querySelectorAll('button')).some(
          (button) =>
            button.textContent === 'Reembolsar' ||
            button.textContent === 'Cancelar',
        ),
    ).toBe(false);
  });

  it('muestra un mensaje vacío cuando el backend no devuelve pagos', async () => {
    // Arrange
    server.use(http.get('/api/backend/payments', () => HttpResponse.json([])));

    // Act
    renderPaymentsTable();

    // Assert
    expect(
      await screen.findByText('No hay pagos para mostrar'),
    ).toBeInTheDocument();
  });

  it('muestra un mensaje de error si la carga falla', async () => {
    // Arrange
    server.use(
      http.get('/api/backend/payments', () =>
        HttpResponse.json({ message: 'Error interno' }, { status: 500 }),
      ),
    );

    // Act
    renderPaymentsTable();

    // Assert
    expect(
      await screen.findByText(
        'No se pudo cargar la lista de pagos. Intentá recargar la página.',
      ),
    ).toBeInTheDocument();
  });

  it('dispara la mutación de reembolso con el motivo seleccionado al confirmar', async () => {
    // Arrange
    const user = userEvent.setup();
    const onRequest = vi.fn();
    server.use(
      http.post(
        '/api/backend/payments/:id/refund',
        async ({ request, params }) => {
          const body = await request.json();
          onRequest(params.id, body);
          return HttpResponse.json({ status: 'REFUNDED' });
        },
      ),
    );
    renderPaymentsTable();
    await screen.findByText('txn-uuid-abc');

    // Act
    await user.click(screen.getByRole('button', { name: 'Reembolsar' }));
    await user.click(
      await screen.findByRole('button', { name: 'Confirmar reembolso' }),
    );

    // Assert
    await waitFor(() => {
      expect(onRequest).toHaveBeenCalledWith(
        'f47ac10b-58cc-4372-a567-0e02b2c3d479',
        expect.objectContaining({
          amount: 186612,
          reason: 'customer_request',
        }),
      );
    });
  });

  it('dispara la mutación de cancelación al confirmar', async () => {
    // Arrange
    const user = userEvent.setup();
    const onRequest = vi.fn();
    server.use(
      http.post('/api/backend/payments/:id/cancel', ({ params }) => {
        onRequest(params.id);
        return HttpResponse.json({ status: 'CANCELLED' });
      }),
    );
    renderPaymentsTable();
    await screen.findByText('txn-uuid-pending');

    // Act
    await user.click(screen.getByRole('button', { name: 'Cancelar' }));
    await user.click(
      await screen.findByRole('button', { name: 'Sí, cancelar' }),
    );

    // Assert
    await waitFor(() => {
      expect(onRequest).toHaveBeenCalledWith(
        '2b1c1e2a-58cc-4372-a567-0e02b2c3d001',
      );
    });
  });

  it('muestra el ícono de propina cuando el pago tiene una', async () => {
    // Arrange
    server.use(
      http.get('/api/backend/payments', () =>
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
    renderPaymentsTable();

    // Assert
    expect(
      await screen.findByRole('img', {
        name: `Propina: ${formatCurrency(15000, 'PYG')}`,
      }),
    ).toBeInTheDocument();
  });
});
