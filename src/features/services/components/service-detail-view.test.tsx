import { QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@/test/render';
import { beforeEach, describe, expect, it } from 'vitest';
import { servicesHandlers } from '@/test/msw/handlers/services';
import { server } from '@/test/msw/server';
import { createTestQueryClient } from '@/test/query-client';
import { ServiceDetailView } from './service-detail-view';

beforeEach(() => {
  server.use(...servicesHandlers);
});

function renderDetailView(id: string) {
  const queryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <ServiceDetailView id={id} />
    </QueryClientProvider>,
  );
}

describe('ServiceDetailView', () => {
  it('muestra los datos del servicio una vez cargado', async () => {
    // Arrange & Act
    renderDetailView('a63b5212-db5e-4ef5-9614-726614174000');

    // Assert
    expect(
      await screen.findByText('Reparación de cañería', {}, { timeout: 3000 }),
    ).toBeInTheDocument();
    expect(screen.getByText('Plomería')).toBeInTheDocument();
    expect(screen.getByText('Juan Pérez')).toBeInTheDocument();
    expect(screen.getByText(/juan@example.com/)).toBeInTheDocument();
    expect(screen.getByText('Av. España 1234, Asunción')).toBeInTheDocument();
  });

  it('muestra un mensaje de error si el servicio no existe', async () => {
    // Arrange & Act
    renderDetailView('id-inexistente');

    // Assert
    expect(
      await screen.findByText(
        'No se pudo cargar el servicio.',
        {},
        { timeout: 3000 },
      ),
    ).toBeInTheDocument();
  });
});
