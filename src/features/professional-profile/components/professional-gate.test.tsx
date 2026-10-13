/**
 * Suite: ProfessionalGate (acceso al modo profesional y aviso de estado)
 * Casos: CP-WEB-ONB-006 (ver test/qa/casos/CP-ONB.md)
 * Tipo: unitaria (componente + MSW)   Prioridad: P1
 * Precondiciones: handlers MSW de professional-mode; sin backend real.
 * Trazabilidad: DEF-WEB-005, plan maestro M3/M4.
 */
import { QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@/test/render';
import { HttpResponse, http } from 'msw';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { server } from '@/test/msw/server';
import { createTestQueryClient } from '@/test/query-client';
import {
  fakeMyProfessionalProfile,
  professionalModeHandlers,
} from '@/test/msw/handlers/professional-mode';
import { ProfessionalGate } from './professional-gate';

const mockReplace = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: mockReplace }),
}));

function renderGate() {
  const queryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <ProfessionalGate>
        <p>Contenido protegido</p>
      </ProfessionalGate>
    </QueryClientProvider>,
  );
}

describe('ProfessionalGate', () => {
  beforeEach(() => {
    mockReplace.mockClear();
    server.use(...professionalModeHandlers);
  });

  it('muestra el contenido cuando el usuario tiene perfil profesional', async () => {
    // Arrange & Act
    renderGate();

    // Assert
    expect(await screen.findByText('Contenido protegido')).toBeInTheDocument();
    expect(mockReplace).not.toHaveBeenCalled();
  });

  it('redirige a / cuando el usuario no tiene perfil profesional', async () => {
    // Arrange
    server.use(
      http.get('/api/backend/professionals/me', () =>
        HttpResponse.json(
          { message: 'Profesional no encontrado' },
          { status: 404 },
        ),
      ),
    );

    // Act
    renderGate();

    // Assert
    await vi.waitFor(() => expect(mockReplace).toHaveBeenCalledWith('/'));
  });

  // DEF-WEB-005
  it('CP-WEB-ONB-006 muestra el aviso de postulación pendiente junto al contenido cuando el perfil está PENDING', async () => {
    // Arrange
    server.use(
      http.get('/api/backend/professionals/me', () =>
        HttpResponse.json({ ...fakeMyProfessionalProfile, status: 'PENDING' }),
      ),
    );

    // Act
    renderGate();

    // Assert
    expect(await screen.findByText('Contenido protegido')).toBeInTheDocument();
    expect(
      screen.getByTestId('professional-status-banner'),
    ).toBeInTheDocument();
  });

  it('CP-WEB-ONB-006 no muestra aviso cuando el perfil está APROBADO', async () => {
    // Arrange & Act
    renderGate();

    // Assert
    await screen.findByText('Contenido protegido');
    expect(screen.queryByTestId('professional-status-banner')).toBeNull();
  });
});
