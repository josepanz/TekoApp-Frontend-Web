/**
 * Suite: ReactivateProfessionalDialog (reactivar un profesional SUSPENDED con motivo obligatorio)
 * Casos: CP-WEB-ONB-009 (ver test/qa/casos/CP-ONB.md)
 * Tipo: unitaria (componente + MSW)   Prioridad: P1
 * Precondiciones: MSW; sin backend real.
 * Trazabilidad: contrato `POST /professionals/:id/reactivate` ({reason} obligatorio con trim; 400 vacio, 409 estado/usuario invalido).
 */
import { QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@/test/render';
import userEvent from '@testing-library/user-event';
import { HttpResponse, http } from 'msw';
import { toast } from 'sonner';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { buildProfessional } from '@/test/msw/handlers/professionals';
import { server } from '@/test/msw/server';
import { createTestQueryClient } from '@/test/query-client';
import { ReactivateProfessionalDialog } from './reactivate-professional-dialog';

vi.mock('sonner', () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

beforeEach(() => {
  vi.mocked(toast.success).mockClear();
  vi.mocked(toast.error).mockClear();
});

function errorEnvelope(
  code: number,
  message: string,
  errors?: { field: string; constraints: Record<string, string> }[],
) {
  return HttpResponse.json(
    {
      success: false,
      error: {
        code,
        message,
        error: code === 409 ? 'Conflict' : 'Bad Request',
        errors,
        timestamp: '2026-10-13T10:00:00.000Z',
        path: '/x',
      },
    },
    { status: code },
  );
}

function renderDialog() {
  const queryClient = createTestQueryClient();
  const professional = buildProfessional({ id: 9, status: 'SUSPENDED' });
  render(
    <QueryClientProvider client={queryClient}>
      <ReactivateProfessionalDialog professional={professional} />
    </QueryClientProvider>,
  );
}

async function openAndSubmit(reason?: string) {
  const user = userEvent.setup();
  await user.click(screen.getByRole('button', { name: 'Reactivar' }));
  if (reason !== undefined) {
    await user.type(await screen.findByLabelText('Motivo'), reason);
  }
  await user.click(
    await screen.findByRole('button', { name: 'Confirmar reactivación' }),
  );
}

describe('ReactivateProfessionalDialog', () => {
  it('CP-WEB-ONB-009 envía el motivo cargado y cierra el diálogo al reactivar', async () => {
    // Arrange
    const onRequest = vi.fn();
    server.use(
      http.post(
        '/api/backend/professionals/:id/reactivate',
        async ({ request, params }) => {
          onRequest(params.id, await request.json());
          return HttpResponse.json(buildProfessional({ status: 'APPROVED' }));
        },
      ),
    );
    renderDialog();

    // Act
    await openAndSubmit('Apelación aceptada');

    // Assert
    await waitFor(() =>
      expect(onRequest).toHaveBeenCalledWith('9', {
        reason: 'Apelación aceptada',
      }),
    );
    await waitFor(() =>
      expect(screen.queryByLabelText('Motivo')).not.toBeInTheDocument(),
    );
    expect(toast.success).toHaveBeenCalled();
  }, 15000);

  it('CP-WEB-ONB-009 no envía nada si el motivo está vacío o en blanco', async () => {
    // Arrange
    const onRequest = vi.fn();
    server.use(
      http.post('/api/backend/professionals/:id/reactivate', () => {
        onRequest();
        return HttpResponse.json(buildProfessional({ status: 'APPROVED' }));
      }),
    );
    renderDialog();

    // Act
    await openAndSubmit('   ');

    // Assert
    expect(
      await screen.findByText('El motivo es obligatorio'),
    ).toBeInTheDocument();
    expect(onRequest).not.toHaveBeenCalled();
  }, 15000);

  it('CP-WEB-ONB-009 mapea el 400 del backend al campo motivo, sin toast', async () => {
    // Arrange
    server.use(
      http.post('/api/backend/professionals/:id/reactivate', () =>
        errorEnvelope(400, 'Validación fallida', [
          {
            field: 'reason',
            constraints: { isNotEmpty: 'reason no puede estar vacío' },
          },
        ]),
      ),
    );
    renderDialog();

    // Act
    await openAndSubmit('motivo');

    // Assert
    expect(
      await screen.findByText('reason no puede estar vacío'),
    ).toBeInTheDocument();
    expect(toast.error).not.toHaveBeenCalled();
  }, 15000);

  it('CP-WEB-ONB-009 ante un 409 avisa con un mensaje claro de que el estado cambió', async () => {
    // Arrange
    server.use(
      http.post('/api/backend/professionals/:id/reactivate', () =>
        errorEnvelope(409, 'conflicto'),
      ),
    );
    renderDialog();

    // Act
    await openAndSubmit('motivo');

    // Assert
    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith(
        expect.stringContaining(
          'Solo se puede reactivar a un profesional suspendido',
        ),
      ),
    );
  }, 15000);
});
