import { QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { HttpResponse, http } from 'msw';
import { describe, expect, it } from 'vitest';
import { server } from '@/test/msw/server';
import { createTestQueryClient } from '@/test/query-client';
import { Overview } from './overview';

function renderOverview() {
  const queryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <Overview />
    </QueryClientProvider>,
  );
}

describe('Overview', () => {
  it('muestra las métricas del dashboard una vez cargadas', async () => {
    // Arrange & Act
    renderOverview();

    // Assert
    expect(await screen.findByText('1.500')).toBeInTheDocument();
    expect(screen.getByText('Usuarios totales')).toBeInTheDocument();
    expect(screen.getByText('4.7')).toBeInTheDocument();
  });

  it('muestra un mensaje de error si la carga falla', async () => {
    // Arrange
    server.use(
      http.get('/api/backend/analytics/dashboard', () =>
        HttpResponse.json({ message: 'Error interno' }, { status: 500 }),
      ),
    );

    // Act
    renderOverview();

    // Assert
    expect(
      await screen.findByText(
        'No se pudieron cargar las métricas del panel. Intentá recargar la página.',
      ),
    ).toBeInTheDocument();
  });
});
