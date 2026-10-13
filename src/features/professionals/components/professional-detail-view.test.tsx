/**
 * Suite: ProfessionalDetailView: acciones admin segun el estado del profesional
 * Casos: CP-WEB-ONB-007 (ver test/qa/casos/CP-ONB.md); el resto de la suite es de carga/errores del detalle
 * Tipo: unitaria (componente + MSW)   Prioridad: P2
 * Precondiciones: handlers MSW de professionals; sin backend real.
 * Trazabilidad: DEF-WEB-013 (verify solo en PENDING/REJECTED, suspend solo en APPROVED; si no, 409).
 */
import { QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@/test/render';
import { http, HttpResponse } from 'msw';
import { beforeEach, describe, expect, it } from 'vitest';
import {
  fakeProfessionalsPage1,
  professionalsHandlers,
} from '@/test/msw/handlers/professionals';
import { server } from '@/test/msw/server';
import { createTestQueryClient } from '@/test/query-client';
import { ProfessionalDetailView } from './professional-detail-view';

beforeEach(() => {
  server.use(...professionalsHandlers);
});

function renderDetailView(referenceId: string) {
  const queryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <ProfessionalDetailView referenceId={referenceId} />
    </QueryClientProvider>,
  );
}

describe('ProfessionalDetailView', () => {
  it('muestra los datos del profesional una vez cargado', async () => {
    // Arrange & Act
    renderDetailView('p1a2b3c4-d5e6-7890-abcd-ef1234567890');

    // Assert
    expect(
      await screen.findByText('Juan Pérez', {}, { timeout: 3000 }),
    ).toBeInTheDocument();
    expect(
      screen.getByText('juan.perez@example.com', { exact: false }),
    ).toBeInTheDocument();
    expect(screen.getByText('Plomería')).toBeInTheDocument();
    expect(screen.getByText('plomería')).toBeInTheDocument();
    expect(screen.getByText('Certificado SENAI')).toBeInTheDocument();
  });

  it('muestra un mensaje de error si el profesional no existe', async () => {
    // Arrange & Act
    renderDetailView('referencia-inexistente');

    // Assert
    expect(
      await screen.findByText(
        'No se pudo cargar el perfil de este profesional.',
        {},
        { timeout: 3000 },
      ),
    ).toBeInTheDocument();
  });

  it('CP-WEB-ONB-007 un profesional APROBADO ofrece suspender pero no verificar (DEF-WEB-013)', async () => {
    renderDetailView('p1a2b3c4-d5e6-7890-abcd-ef1234567890');
    await screen.findByText('Juan Pérez', {}, { timeout: 3000 });
    expect(
      screen.getByRole('button', { name: 'Suspender' }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Verificar' }),
    ).not.toBeInTheDocument();
  });

  it('CP-WEB-ONB-007 un profesional SUSPENDIDO no ofrece verificar ni suspender (DEF-WEB-013)', async () => {
    server.use(
      http.get('/api/backend/professionals/reference/:referenceId', () =>
        HttpResponse.json({
          ...fakeProfessionalsPage1.data[0],
          status: 'SUSPENDED',
        }),
      ),
    );
    renderDetailView('p1a2b3c4-d5e6-7890-abcd-ef1234567890');
    await screen.findByText('Juan Pérez', {}, { timeout: 3000 });
    expect(
      screen.queryByRole('button', { name: 'Verificar' }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Suspender' }),
    ).not.toBeInTheDocument();
  });
});
