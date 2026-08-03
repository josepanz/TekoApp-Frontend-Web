import { QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@/test/render';
import { HttpResponse, http } from 'msw';
import { describe, expect, it } from 'vitest';
import { server } from '@/test/msw/server';
import { createTestQueryClient } from '@/test/query-client';
import { UserDetailView } from './user-detail-view';

function renderDetailView(referenceId: string) {
  const queryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <UserDetailView referenceId={referenceId} />
    </QueryClientProvider>,
  );
}

describe('UserDetailView', () => {
  it('muestra los datos del usuario una vez cargado', async () => {
    // Arrange & Act
    renderDetailView('a1b2c3d4-e5f6-7890-abcd-ef1234567890');

    // Assert
    expect(
      await screen.findByText('Ana González', {}, { timeout: 3000 }),
    ).toBeInTheDocument();
    expect(
      screen.getByText('ana.gonzalez@example.com', { exact: false }),
    ).toBeInTheDocument();
    expect(screen.getByText('Activo')).toBeInTheDocument();
  });

  it('muestra un mensaje de error si el usuario no existe', async () => {
    // Arrange
    server.use(
      http.get('/api/backend/users/reference/:referenceId', () => {
        return new HttpResponse(null, { status: 404 });
      }),
    );

    // Act
    renderDetailView('referencia-inexistente');

    // Assert
    expect(
      await screen.findByText(
        'No se pudo cargar el usuario.',
        {},
        { timeout: 3000 },
      ),
    ).toBeInTheDocument();
  });
});
