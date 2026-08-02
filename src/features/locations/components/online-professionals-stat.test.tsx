import { QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@/test/render';
import { HttpResponse, http } from 'msw';
import { describe, expect, it } from 'vitest';
import { server } from '@/test/msw/server';
import { createTestQueryClient } from '@/test/query-client';
import { OnlineProfessionalsStat } from './online-professionals-stat';

function renderStat() {
  const queryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <OnlineProfessionalsStat />
    </QueryClientProvider>,
  );
}

describe('OnlineProfessionalsStat', () => {
  it('muestra la cantidad de profesionales en línea una vez cargada', async () => {
    // Arrange & Act
    renderStat();

    // Assert
    expect(await screen.findByText('7')).toBeInTheDocument();
    expect(screen.getByText('Profesionales en línea')).toBeInTheDocument();
  });

  it('muestra un guion si falla la carga', async () => {
    // Arrange
    server.use(
      http.get('/api/backend/locations/online-count', () =>
        HttpResponse.json({ message: 'Error interno' }, { status: 500 }),
      ),
    );

    // Act
    renderStat();

    // Assert
    expect(await screen.findByText('—')).toBeInTheDocument();
  });
});
