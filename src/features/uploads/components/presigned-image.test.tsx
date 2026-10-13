/**
 * Suite: PresignedImage (imagen por URL presignada con placeholder ante 403/404)
 * Casos: CP-WEB-IMG-001..003 (ver test/qa/casos/CP-ONB.md)
 * Tipo: unitaria (componente + MSW)   Prioridad: P1
 * Precondiciones: handlers MSW inline de `uploads/presigned-url`; sin backend real.
 * Trazabilidad: DEF-WEB-008 (imagen rota ante 403/404 del presigned), plan maestro M3.
 */
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ApiError } from '@/core/api-client/errors';
import { fireEvent } from '@testing-library/react';
import { HttpResponse, http } from 'msw';
import { describe, expect, it } from 'vitest';
import { render, screen } from '@/test/render';
import { server } from '@/test/msw/server';
import { createTestQueryClient } from '@/test/query-client';
import { PresignedImage } from './presigned-image';

function renderImage() {
  return render(
    <QueryClientProvider client={createTestQueryClient()}>
      <PresignedImage fileKey="foto.jpg" alt="Trabajo" className="size-20" />
    </QueryClientProvider>,
  );
}

function presignedError(status: number) {
  return http.get('/api/backend/uploads/presigned-url', () =>
    HttpResponse.json(
      {
        success: false,
        error: {
          code: status,
          message: 'sin acceso',
          error: 'x',
          timestamp: '2026-10-13T10:00:00.000Z',
          path: '/x',
        },
      },
      { status },
    ),
  );
}

describe('PresignedImage', () => {
  it('muestra la imagen cuando el presigned resuelve', async () => {
    // Arrange
    server.use(
      http.get('/api/backend/uploads/presigned-url', () =>
        HttpResponse.json({ url: 'https://files.example/foto.jpg?sig=1' }),
      ),
    );

    // Act
    renderImage();

    // Assert
    const img = await screen.findByRole('img', { name: 'Trabajo' });
    expect(img).toHaveAttribute('src', 'https://files.example/foto.jpg?sig=1');
  });

  it.each([403, 404])(
    'muestra un placeholder, no una imagen rota, si el presigned responde %i',
    async (status) => {
      // Arrange
      server.use(presignedError(status));

      // Act
      renderImage();

      // Assert
      expect(
        await screen.findByTestId('image-placeholder'),
      ).toBeInTheDocument();
      expect(screen.queryByRole('img', { name: 'Trabajo' })).toBeNull();
    },
  );

  it('muestra el placeholder si la URL presignada no carga el archivo', async () => {
    // Arrange
    server.use(
      http.get('/api/backend/uploads/presigned-url', () =>
        HttpResponse.json({ url: 'https://files.example/roto.jpg' }),
      ),
    );
    renderImage();
    const img = await screen.findByRole('img', { name: 'Trabajo' });

    // Act
    fireEvent.error(img);

    // Assert
    expect(await screen.findByTestId('image-placeholder')).toBeInTheDocument();
  });

  // DEF-WEB-008: el QueryClient de produccion propaga todo 403 al error boundary (pantalla de sin
  // acceso); el presigned 403 NO debe tumbar la pagina entera.
  it('un 403 del presigned no se propaga al error boundary global', async () => {
    // Arrange
    server.use(presignedError(403));
    const prodLikeClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: 0,
          throwOnError: (error) =>
            error instanceof ApiError && error.status === 403,
        },
      },
    });

    // Act
    render(
      <QueryClientProvider client={prodLikeClient}>
        <PresignedImage fileKey="foto.jpg" alt="Trabajo" className="size-20" />
      </QueryClientProvider>,
    );

    // Assert: llega a mostrar el placeholder en vez de lanzar el error al arbol
    expect(await screen.findByTestId('image-placeholder')).toBeInTheDocument();
  });
});
