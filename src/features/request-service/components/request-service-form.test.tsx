import { QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { server } from '@/test/msw/server';
import { createTestQueryClient } from '@/test/query-client';
import { clientModeHandlers } from '@/test/msw/handlers/client-mode';
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
});
