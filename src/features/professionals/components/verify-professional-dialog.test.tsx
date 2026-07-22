import { QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HttpResponse, http } from 'msw';
import { describe, expect, it, vi } from 'vitest';
import { buildProfessional } from '@/test/msw/handlers/professionals';
import { server } from '@/test/msw/server';
import { createTestQueryClient } from '@/test/query-client';
import { VerifyProfessionalDialog } from './verify-professional-dialog';

function renderDialog() {
  const queryClient = createTestQueryClient();
  const professional = buildProfessional({
    id: 7,
    verificationStatus: 'pending',
  });
  render(
    <QueryClientProvider client={queryClient}>
      <VerifyProfessionalDialog professional={professional} />
    </QueryClientProvider>,
  );
}

describe('VerifyProfessionalDialog', () => {
  it('envía isVerified y las notas cargadas al confirmar la verificación', async () => {
    // Arrange
    const user = userEvent.setup();
    const onRequest = vi.fn();
    server.use(
      http.post(
        '/api/backend/professionals/:id/verify',
        async ({ request, params }) => {
          const body = await request.json();
          onRequest(params.id, body);
          return HttpResponse.json(
            buildProfessional({ verificationStatus: 'verified' }),
          );
        },
      ),
    );
    renderDialog();

    // Act
    await user.click(screen.getByRole('button', { name: 'Verificar' }));
    await user.type(
      await screen.findByLabelText('Notas'),
      'Documentación validada',
    );
    await user.click(screen.getByRole('button', { name: 'Confirmar' }));

    // Assert
    await waitFor(() => {
      expect(onRequest).toHaveBeenCalledWith('7', {
        isVerified: true,
        notes: 'Documentación validada',
      });
    });
  }, 15000);

  it('envía isVerified en false cuando se desactiva el switch de verificación', async () => {
    // Arrange
    const user = userEvent.setup();
    const onRequest = vi.fn();
    server.use(
      http.post(
        '/api/backend/professionals/:id/verify',
        async ({ request, params }) => {
          const body = await request.json();
          onRequest(params.id, body);
          return HttpResponse.json(
            buildProfessional({ verificationStatus: 'rejected' }),
          );
        },
      ),
    );
    renderDialog();

    // Act
    await user.click(screen.getByRole('button', { name: 'Verificar' }));
    // El toggle nativo de checkbox que dispara el Switch de Base UI (dispatchEvent de un
    // PointerEvent sintético sobre el input oculto) no siempre completa su ciclo de activación
    // en jsdom vía la secuencia de puntero de `user-event` — `fireEvent.click` es el caso puntual
    // documentado en rules/test.md donde se justifica no usar `user-event`.
    fireEvent.click(screen.getByRole('switch'));
    await user.click(screen.getByRole('button', { name: 'Confirmar' }));

    // Assert
    await waitFor(() => {
      expect(onRequest).toHaveBeenCalledWith('7', { isVerified: false });
    });
  }, 15000);
});
