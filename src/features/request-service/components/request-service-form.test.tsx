import { QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@/test/render';
import userEvent from '@testing-library/user-event';
import { HttpResponse, http } from 'msw';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { server } from '@/test/msw/server';
import { createTestQueryClient } from '@/test/query-client';
import { clientModeHandlers } from '@/test/msw/handlers/client-mode';
import { buildService } from '@/test/msw/handlers/services';
import { RequestServiceForm } from './request-service-form';

const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}));

// Leaflet necesita layout real del DOM (getBoundingClientRect con dimensiones reales) que jsdom
// no provee — mismo motivo que el mock de Google Maps en features/locations. Se prueba el wiring
// del form (lat/lng viajan con sus valores por defecto), no la interacción con el mapa en sí.
vi.mock('./location-picker-map', () => ({
  LocationPickerMap: () => <div data-testid="location-picker-map" />,
}));

function renderForm() {
  const queryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <RequestServiceForm />
    </QueryClientProvider>,
  );
}

describe('RequestServiceForm', () => {
  beforeEach(() => {
    mockPush.mockClear();
    server.use(...clientModeHandlers);
  });

  it('carga categorías y tipos de servicio y envía la solicitud', async () => {
    // Arrange
    const user = userEvent.setup();
    renderForm();
    await screen.findByLabelText('Título');

    // Act
    await user.type(screen.getByLabelText('Título'), 'Arreglar canilla');
    await user.type(
      screen.getByLabelText('Descripción'),
      'Se rompió la canilla de la cocina',
    );
    await user.click(screen.getByLabelText('Categoría'));
    await user.click(await screen.findByRole('option', { name: 'Plomería' }));
    await user.click(screen.getByLabelText('Tipo de servicio'));
    await user.click(
      await screen.findByRole('option', { name: 'Instalación' }),
    );
    await user.type(screen.getByLabelText('Dirección'), 'Av. España 1234');
    await user.click(
      screen.getByRole('button', { name: 'Solicitar profesional' }),
    );

    // Assert
    await vi.waitFor(() =>
      expect(mockPush).toHaveBeenCalledWith('/mis-servicios'),
    );
  });

  it('permite fijar la ubicacion con Tab + type, sin ningun evento de mouse', async () => {
    // Arrange
    const user = userEvent.setup();
    let requestBody: { latitude?: number; longitude?: number } | undefined;
    server.use(
      http.post('/api/backend/services', async ({ request }) => {
        requestBody = (await request.json()) as {
          latitude?: number;
          longitude?: number;
        };
        return HttpResponse.json(buildService({ referenceId: 'new-svc-002' }), {
          status: 201,
        });
      }),
    );
    renderForm();
    await screen.findByLabelText('Título');

    await user.type(screen.getByLabelText('Título'), 'Arreglar canilla');
    await user.type(
      screen.getByLabelText('Descripción'),
      'Se rompió la canilla de la cocina',
    );
    await user.click(screen.getByLabelText('Categoría'));
    await user.click(await screen.findByRole('option', { name: 'Plomería' }));
    await user.click(screen.getByLabelText('Tipo de servicio'));
    await user.click(
      await screen.findByRole('option', { name: 'Instalación' }),
    );
    await user.click(screen.getByLabelText('Dirección'));
    await user.type(screen.getByLabelText('Dirección'), 'Av. España 1234');

    // Act — fijar la ubicación solo con teclado, sin arrastrar ni hacer click en el mapa.
    // El signo "-" se escribe al final, moviendo el cursor al inicio: un input type=number
    // sanitiza un "-" suelto a "" apenas es el único carácter (regla de HTML, no un bug acá).
    await user.tab();
    const latitudeInput = screen.getByLabelText('Latitud');
    await user.clear(latitudeInput);
    await user.type(latitudeInput, '25.3');
    await user.type(latitudeInput, '{Home}-');
    await user.tab();
    const longitudeInput = screen.getByLabelText('Longitud');
    await user.clear(longitudeInput);
    await user.type(longitudeInput, '57.6');
    await user.type(longitudeInput, '{Home}-');
    await user.click(
      screen.getByRole('button', { name: 'Solicitar profesional' }),
    );

    // Assert
    await vi.waitFor(() => expect(requestBody).toBeDefined());
    expect(requestBody?.latitude).toBeCloseTo(-25.3);
    expect(requestBody?.longitude).toBeCloseTo(-57.6);
  });
});
