import { QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@/test/render';
import { HttpResponse, http } from 'msw';
import { beforeEach, describe, expect, it } from 'vitest';
import { server } from '@/test/msw/server';
import { createTestQueryClient } from '@/test/query-client';
import { professionalModeHandlers } from '@/test/msw/handlers/professional-mode';
import { ProfessionalRatingStatsCard } from './professional-rating-stats-card';

// `professionalModeHandlers` ya mockea GET /professionals/me devolviendo id=5 (ver
// `fakeMyProfessionalProfile`) — la tarjeta lo necesita para pedir sus propias estadísticas.
function renderCard() {
  const queryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <ProfessionalRatingStatsCard />
    </QueryClientProvider>,
  );
}

describe('ProfessionalRatingStatsCard', () => {
  beforeEach(() => {
    server.use(...professionalModeHandlers);
  });

  it('muestra el promedio, el total y la distribución por estrellas', async () => {
    // Arrange
    server.use(
      http.get('/api/backend/ratings/professional/5/average', () =>
        HttpResponse.json({
          averageRating: 4.7,
          totalRatings: 12,
          ratingDistribution: { '1': 0, '2': 0, '3': 1, '4': 4, '5': 7 },
          averageCriteria: { puntualidad: 4.8 },
        }),
      ),
    );

    // Act
    renderCard();

    // Assert
    expect(await screen.findByText('4.7')).toBeInTheDocument();
    expect(screen.getByText('12 calificaciones')).toBeInTheDocument();
    expect(screen.getByText('puntualidad')).toBeInTheDocument();
  });

  it('muestra un estado vacío cuando todavía no recibió calificaciones', async () => {
    // Arrange
    server.use(
      http.get('/api/backend/ratings/professional/5/average', () =>
        HttpResponse.json({
          averageRating: 0,
          totalRatings: 0,
          ratingDistribution: { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0 },
          averageCriteria: {},
        }),
      ),
    );

    // Act
    renderCard();

    // Assert
    expect(
      await screen.findByText('Todavía no recibiste ninguna calificación'),
    ).toBeInTheDocument();
  });
});
