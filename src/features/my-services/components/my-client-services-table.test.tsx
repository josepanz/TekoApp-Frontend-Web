import { QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@/test/render';
import { beforeEach, describe, expect, it } from 'vitest';
import { server } from '@/test/msw/server';
import { createTestQueryClient } from '@/test/query-client';
import { clientModeHandlers } from '@/test/msw/handlers/client-mode';
import { MyClientServicesTable } from './my-client-services-table';

function renderTable() {
  const queryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <MyClientServicesTable />
    </QueryClientProvider>,
  );
}

describe('MyClientServicesTable', () => {
  beforeEach(() => {
    server.use(...clientModeHandlers);
  });

  it('muestra la acción de cancelar en servicios pendientes y de calificar en completados', async () => {
    // Arrange & Act
    renderTable();

    // Assert
    await screen.findAllByText('Reparación de cañería');
    expect(
      screen.getByRole('button', { name: 'Cancelar' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Calificar profesional' }),
    ).toBeInTheDocument();
  });
});
