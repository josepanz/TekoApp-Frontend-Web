import { QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@/test/render';
import { HttpResponse, http } from 'msw';
import { describe, expect, it } from 'vitest';
import { server } from '@/test/msw/server';
import { createTestQueryClient } from '@/test/query-client';
import { MyRatingStatsCard } from './my-rating-stats-card';

function renderCard() {
  const queryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <MyRatingStatsCard />
    </QueryClientProvider>,
  );
}

describe('MyRatingStatsCard', () => {
  it('muestra las calificaciones dadas y recibidas con sus promedios', async () => {
    // Arrange
    server.use(
      http.get('/api/backend/ratings/me/stats', () =>
        HttpResponse.json({
          givenRatings: 3,
          receivedRatings: 1,
          averageGivenRating: 4.5,
          averageReceivedRating: 5,
        }),
      ),
    );

    // Act
    renderCard();

    // Assert
    expect(await screen.findByText('3')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText(/4\.5/)).toBeInTheDocument();
    expect(screen.getByText(/5\.0/)).toBeInTheDocument();
  });

  it('muestra un mensaje de error cuando falla la carga', async () => {
    // Arrange
    server.use(
      http.get('/api/backend/ratings/me/stats', () =>
        HttpResponse.json({ message: 'error' }, { status: 500 }),
      ),
    );

    // Act
    renderCard();

    // Assert
    expect(
      await screen.findByText('No se pudieron cargar tus calificaciones.'),
    ).toBeInTheDocument();
  });
});
