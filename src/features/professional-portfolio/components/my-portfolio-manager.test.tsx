import { QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@/test/render';
import userEvent from '@testing-library/user-event';
import { HttpResponse, http } from 'msw';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { professionalPortfolioHandlers } from '@/test/msw/handlers/professional-portfolio';
import { server } from '@/test/msw/server';
import { createTestQueryClient } from '@/test/query-client';
import { MyPortfolioManager } from './my-portfolio-manager';

beforeEach(() => {
  server.use(...professionalPortfolioHandlers);
});

function renderManager() {
  const queryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <MyPortfolioManager />
    </QueryClientProvider>,
  );
}

describe('MyPortfolioManager', () => {
  it('muestra las fotos ya subidas con su estado', async () => {
    // Arrange & Act
    renderManager();

    // Assert
    expect(await screen.findByText('Pendiente')).toBeInTheDocument();
  });

  it('sube una foto nueva al portafolio', async () => {
    // Arrange
    const user = userEvent.setup();
    const onUpload = vi.fn();
    server.use(
      http.post('/api/backend/professionals/me/portfolio', () => {
        onUpload();
        return HttpResponse.json({
          referenceId: 'portfolio-2',
          fileKey: 'nueva-foto.jpg',
          sortOrder: 0,
          isVisible: true,
          status: 'PENDING',
          createdAt: '2026-09-01T10:00:00.000Z',
        });
      }),
    );
    renderManager();
    await screen.findByText('Pendiente');
    const file = new File(['foto'], 'foto.jpg', { type: 'image/jpeg' });

    // Act
    await user.upload(screen.getByLabelText('Subir foto'), file);

    // Assert
    await waitFor(() => expect(onUpload).toHaveBeenCalled());
  });

  it('elimina una foto tras confirmar en el diálogo', async () => {
    // Arrange
    const user = userEvent.setup();
    const onDelete = vi.fn();
    server.use(
      http.delete(
        '/api/backend/professionals/me/portfolio/:referenceId',
        ({ params }) => {
          onDelete(params.referenceId);
          return new HttpResponse(null, { status: 204 });
        },
      ),
    );
    renderManager();
    await screen.findByText('Pendiente');

    // Act
    await user.click(screen.getByRole('button', { name: 'Eliminar foto' }));
    await user.click(await screen.findByRole('button', { name: 'Eliminar' }));

    // Assert
    await waitFor(() => expect(onDelete).toHaveBeenCalledWith('portfolio-1'));
  });
});
