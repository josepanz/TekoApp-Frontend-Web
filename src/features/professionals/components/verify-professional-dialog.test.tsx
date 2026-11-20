/**
 * Suite: VerifyProfessionalDialog (verificar con nota opcional; rechazar con nota obligatoria)
 * Casos: CP-WEB-ONB-008 (ver test/qa/casos/CP-ONB.md)
 * Tipo: unitaria (componente + MSW)   Prioridad: P1
 * Precondiciones: MSW; sin backend real.
 * Trazabilidad: contrato `POST /professionals/:id/verify` (notes obligatorio al rechazar) y `/suspend` (reason obligatorio).
 */
import { QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor } from '@/test/render';
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
    verificationStatus: 'UNVERIFIED',
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
            buildProfessional({ verificationStatus: 'VERIFIED' }),
          );
        },
      ),
    );
    renderDialog();

    // Act
    await user.click(screen.getByRole('button', { name: 'Verificar' }));
    await user.type(
      await screen.findByLabelText('Notas (opcional)'),
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
            buildProfessional({ verificationStatus: 'REJECTED' }),
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
    await user.type(
      await screen.findByLabelText('Nota (obligatoria al rechazar)'),
      'Documentación ilegible',
    );
    await user.click(screen.getByRole('button', { name: 'Confirmar' }));

    // Assert
    await waitFor(() => {
      expect(onRequest).toHaveBeenCalledWith('7', {
        isVerified: false,
        notes: 'Documentación ilegible',
      });
    });
  }, 15000);

  it('CP-WEB-ONB-008 verificar sin nota es válido (la nota es opcional)', async () => {
    // Arrange
    const user = userEvent.setup();
    const onRequest = vi.fn();
    server.use(
      http.post(
        '/api/backend/professionals/:id/verify',
        async ({ request }) => {
          onRequest(await request.json());
          return HttpResponse.json(
            buildProfessional({ verificationStatus: 'VERIFIED' }),
          );
        },
      ),
    );
    renderDialog();

    // Act
    await user.click(screen.getByRole('button', { name: 'Verificar' }));
    await user.click(await screen.findByRole('button', { name: 'Confirmar' }));

    // Assert
    await waitFor(() =>
      expect(onRequest).toHaveBeenCalledWith({ isVerified: true }),
    );
  }, 15000);

  it('CP-WEB-ONB-008 rechazar sin nota (vacía o en blanco) muestra el error y no envía', async () => {
    // Arrange
    const user = userEvent.setup();
    const onRequest = vi.fn();
    server.use(
      http.post('/api/backend/professionals/:id/verify', async () => {
        onRequest();
        return HttpResponse.json(buildProfessional({ status: 'REJECTED' }));
      }),
    );
    renderDialog();

    // Act
    await user.click(screen.getByRole('button', { name: 'Verificar' }));
    fireEvent.click(screen.getByRole('switch'));
    await user.type(
      await screen.findByLabelText('Nota (obligatoria al rechazar)'),
      '   ',
    );
    await user.click(screen.getByRole('button', { name: 'Confirmar' }));

    // Assert
    expect(
      await screen.findByText('La nota es obligatoria al rechazar'),
    ).toBeInTheDocument();
    expect(onRequest).not.toHaveBeenCalled();
  }, 15000);
});
