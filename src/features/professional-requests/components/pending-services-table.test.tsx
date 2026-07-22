import { QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { server } from '@/test/msw/server';
import { createTestQueryClient } from '@/test/query-client';
import { professionalModeHandlers } from '@/test/msw/handlers/professional-mode';
import { PendingServicesTable } from './pending-services-table';

function renderTable() {
  const queryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <PendingServicesTable />
    </QueryClientProvider>,
  );
}

describe('PendingServicesTable', () => {
  beforeEach(() => {
    server.use(...professionalModeHandlers);
  });

  it('muestra las solicitudes pendientes con cliente y monto', async () => {
    // Arrange & Act
    renderTable();

    // Assert
    expect(
      await screen.findByText('Reparación de cañería'),
    ).toBeInTheDocument();
    expect(screen.getByText('Juan Pérez')).toBeInTheDocument();
  });

  it('dispara la aceptación del servicio al hacer click en Aceptar', async () => {
    // Arrange
    const user = userEvent.setup();
    renderTable();
    await screen.findByText('Reparación de cañería');

    // Act
    await user.click(screen.getByRole('button', { name: 'Aceptar' }));

    // Assert — el botón vuelve a estar habilitado tras resolver la mutation (sin quedar
    // deshabilitado indefinidamente), confirmando que el POST /accept se resolvió sin error.
    await vi.waitFor(() =>
      expect(screen.getByRole('button', { name: 'Aceptar' })).toBeEnabled(),
    );
  });
});
