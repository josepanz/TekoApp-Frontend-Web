import { QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@/test/render';
import { beforeEach, describe, expect, it } from 'vitest';
import { server } from '@/test/msw/server';
import { createTestQueryClient } from '@/test/query-client';
import { clientModeHandlers } from '@/test/msw/handlers/client-mode';
import { professionalPortfolioHandlers } from '@/test/msw/handlers/professional-portfolio';
import { ProfessionalDetailCard } from './professional-detail-card';

const REFERENCE_ID = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';

function renderCard() {
  const queryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <ProfessionalDetailCard referenceId={REFERENCE_ID} />
    </QueryClientProvider>,
  );
}

describe('ProfessionalDetailCard', () => {
  beforeEach(() => {
    server.use(...clientModeHandlers, ...professionalPortfolioHandlers);
  });

  it('muestra el nombre y la categoría del profesional', async () => {
    // Arrange & Act
    renderCard();

    // Assert
    expect(await screen.findByText('Juan Pérez')).toBeInTheDocument();
    expect(screen.getByText('Plomería')).toBeInTheDocument();
  });

  it('muestra la galería de trabajos anteriores aprobados', async () => {
    // Arrange & Act
    renderCard();

    // Assert
    expect(await screen.findByText('Trabajos anteriores')).toBeInTheDocument();
  });
});
