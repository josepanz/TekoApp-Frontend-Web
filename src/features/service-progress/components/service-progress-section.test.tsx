import { QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@/test/render';
import { beforeEach, describe, expect, it } from 'vitest';
import { http, HttpResponse } from 'msw';
import { server } from '@/test/msw/server';
import { createTestQueryClient } from '@/test/query-client';
import {
  buildServiceProgressEntry,
  serviceProgressHandlers,
} from '@/test/msw/handlers/service-progress';
import { ServiceProgressSection } from './service-progress-section';

function renderSection() {
  const queryClient = createTestQueryClient();
  render(
    <QueryClientProvider client={queryClient}>
      <ServiceProgressSection serviceId="svc-1" />
    </QueryClientProvider>,
  );
  return queryClient;
}

function mockScope(permissions: string[]) {
  server.use(
    http.get('/api/backend/auth/scope', () => {
      return HttpResponse.json({
        permissions: permissions.map((name) => ({ name })),
        roles: [],
      });
    }),
  );
}

beforeEach(() => {
  server.use(...serviceProgressHandlers);
});

describe('ServiceProgressSection', () => {
  it('no renderiza nada si el usuario no tiene permiso de auditoría', async () => {
    // Arrange
    mockScope([]);

    // Act
    const queryClient = renderSection();

    // Assert — esperar a que la query de scope resuelva antes de afirmar que no hay nada
    await waitFor(() =>
      expect(queryClient.getQueryState(['auth', 'scope'])?.status).toBe(
        'success',
      ),
    );
    expect(screen.queryByText('Bitácora de avance')).not.toBeInTheDocument();
  });

  it('muestra el estado vacío cuando el staff tiene permiso pero no hay entradas', async () => {
    // Arrange
    mockScope(['service-progress.audit:read']);

    // Act
    renderSection();

    // Assert
    expect(
      await screen.findByText('Bitácora de avance', {}, { timeout: 3000 }),
    ).toBeInTheDocument();
    expect(
      await screen.findByText('Todavía no hay avances registrados'),
    ).toBeInTheDocument();
  });

  it('muestra las entradas existentes con su nota', async () => {
    // Arrange
    mockScope(['admin:all']);
    server.use(
      http.get('/api/backend/services/:id/progress', () => {
        return HttpResponse.json({
          data: [buildServiceProgressEntry({ note: 'Cambié la cañería' })],
        });
      }),
    );

    // Act
    renderSection();

    // Assert
    expect(
      await screen.findByText('Cambié la cañería', {}, { timeout: 3000 }),
    ).toBeInTheDocument();
  });

  it('muestra un mensaje de error si falla la carga de la bitácora', async () => {
    // Arrange
    mockScope(['admin:all']);
    server.use(
      http.get('/api/backend/services/:id/progress', () => {
        return new HttpResponse(null, { status: 500 });
      }),
    );

    // Act
    renderSection();

    // Assert
    expect(
      await screen.findByText(
        'No se pudo cargar la bitácora',
        {},
        { timeout: 3000 },
      ),
    ).toBeInTheDocument();
  });
});
