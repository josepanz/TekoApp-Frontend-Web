import { QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@/test/render';
import { HttpResponse, http } from 'msw';
import { beforeEach, describe, expect, it } from 'vitest';
import { professionalPortfolioHandlers } from '@/test/msw/handlers/professional-portfolio';
import { server } from '@/test/msw/server';
import { createTestQueryClient } from '@/test/query-client';
import { PublicPortfolioGallery } from './public-portfolio-gallery';

beforeEach(() => {
  server.use(...professionalPortfolioHandlers);
});

function renderGallery() {
  const queryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <PublicPortfolioGallery professionalReferenceId="prof-1" />
    </QueryClientProvider>,
  );
}

describe('PublicPortfolioGallery', () => {
  it('muestra el título de la galería cuando hay fotos aprobadas', async () => {
    // Arrange & Act
    renderGallery();

    // Assert
    expect(await screen.findByText('Trabajos anteriores')).toBeInTheDocument();
  });

  it('no muestra nada cuando el profesional no tiene fotos aprobadas', async () => {
    // Arrange
    server.use(
      http.get('/api/backend/professionals/:referenceId/portfolio/public', () =>
        HttpResponse.json({ data: [] }),
      ),
    );

    // Act
    const { container } = renderGallery();

    // Assert
    await waitFor(() => expect(container).toBeEmptyDOMElement());
  });
});
