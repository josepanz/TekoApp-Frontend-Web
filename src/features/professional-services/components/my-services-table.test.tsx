import { QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { server } from '@/test/msw/server';
import { createTestQueryClient } from '@/test/query-client';
import { professionalModeHandlers } from '@/test/msw/handlers/professional-mode';
import { MyServicesTable } from './my-services-table';

function renderTable() {
  const queryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <MyServicesTable />
    </QueryClientProvider>,
  );
}

describe('MyServicesTable', () => {
  beforeEach(() => {
    server.use(...professionalModeHandlers);
  });

  it('muestra la acción correcta según el estado de cada servicio', async () => {
    // Arrange & Act
    renderTable();

    // Assert
    await screen.findAllByText('Reparación de cañería');
    expect(screen.getByRole('button', { name: 'Iniciar' })).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Completar' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Calificar cliente' }),
    ).toBeInTheDocument();
  });
});
