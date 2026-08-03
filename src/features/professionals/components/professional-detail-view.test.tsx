import { QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@/test/render';
import { beforeEach, describe, expect, it } from 'vitest';
import { professionalsHandlers } from '@/test/msw/handlers/professionals';
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
});
