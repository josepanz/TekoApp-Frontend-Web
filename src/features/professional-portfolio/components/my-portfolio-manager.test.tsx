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

  // DEF-WEB-004: 403 CONSENT_REQUIRED de IMAGE_USAGE_CONSENT -> aceptar y reintentar
  it('CP-WEB-ONB-003 ante 403 CONSENT_REQUIRED pide aceptar el consentimiento de imágenes y reintenta', async () => {
    // Arrange
    const user = userEvent.setup();
    let uploads = 0;
    const accepted: string[] = [];
    server.use(
      http.post('/api/backend/professionals/me/portfolio', () => {
        uploads += 1;
        if (accepted.length === 0) {
          return HttpResponse.json(
            {
              success: false,
              error: {
                code: 403,
                message: 'Necesitás aceptar el documento legal vigente',
                error: 'Forbidden',
                errorCode: 'CONSENT_REQUIRED',
                timestamp: '2026-10-13T10:00:00.000Z',
                path: '/x',
              },
            },
            { status: 403 },
          );
        }
        return HttpResponse.json(
          {
            referenceId: 'portfolio-3',
            fileKey: 'otra.jpg',
            sortOrder: 0,
            isVisible: true,
            status: 'PENDING',
            createdAt: '2026-09-01T10:00:00.000Z',
          },
          { status: 201 },
        );
      }),
      http.get('/api/backend/legal/consents/pending', () =>
        HttpResponse.json([
          {
            referenceId: 'v-imagen',
            documentType: 'IMAGE_USAGE_CONSENT',
            version: 'v1',
            contentUrl: 'https://legal.example/imagen',
            publishedAt: '2026-10-01T00:00:00.000Z',
            isActive: true,
          },
        ]),
      ),
      http.post(
        '/api/backend/legal/consents/:versionReferenceId/accept',
        ({ params }) => {
          accepted.push(String(params.versionReferenceId));
          return HttpResponse.json({ referenceId: 'c-1' }, { status: 201 });
        },
      ),
    );
    renderManager();
    await screen.findByText('Pendiente');

    // Act
    await user.upload(
      screen.getByLabelText('Subir foto'),
      new File(['foto'], 'foto.jpg', { type: 'image/jpeg' }),
    );
    await user.click(
      await screen.findByRole('button', { name: 'Acepto y continuar' }),
    );

    // Assert
    await waitFor(() => expect(uploads).toBe(2));
    expect(accepted).toEqual(['v-imagen']);
  });
});
