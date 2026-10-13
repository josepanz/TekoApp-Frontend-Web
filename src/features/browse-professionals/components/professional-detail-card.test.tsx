/**
 * Suite: ProfessionalDetailCard (perfil publico del profesional para el cliente)
 * Casos: CP-WEB-ONB-004 (ver test/qa/casos/CP-ONB.md)
 * Tipo: unitaria (componente + MSW)   Prioridad: P1
 * Precondiciones: handlers MSW de client-mode y portfolio; sin backend real.
 * Trazabilidad: DEF-WEB-007 (404 de profesional no aprobado mostrado como error generico), M3.
 */
import { QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@/test/render';
import { HttpResponse, http } from 'msw';
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

  // DEF-WEB-007
  it('CP-WEB-ONB-004 muestra una pantalla amable de "no disponible" cuando el backend responde 404', async () => {
    // Arrange
    server.use(
      http.get('/api/backend/professionals/reference/:referenceId', () =>
        HttpResponse.json(
          {
            success: false,
            error: {
              code: 404,
              message: 'Profesional no encontrado',
              error: 'Not Found',
              timestamp: '2026-10-13T10:00:00.000Z',
              path: '/x',
            },
          },
          { status: 404 },
        ),
      ),
    );

    // Act
    renderCard();

    // Assert
    expect(
      await screen.findByTestId('professional-not-found'),
    ).toHaveTextContent('Profesional no disponible');
    expect(
      screen.getByRole('link', { name: 'Volver a profesionales' }),
    ).toHaveAttribute('href', '/profesionales');
  });
});
