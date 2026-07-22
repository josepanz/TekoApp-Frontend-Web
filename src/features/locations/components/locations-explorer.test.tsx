import { QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { createTestQueryClient } from '@/test/query-client';
import { LocationsExplorer } from './locations-explorer';

// Ver locations-map.test.tsx — jsdom no puede cargar el script real de Google Maps.
vi.mock('@vis.gl/react-google-maps', () => ({
  APIProvider: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  Map: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Marker: () => <div />,
}));

function renderExplorer() {
  const queryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <LocationsExplorer />
    </QueryClientProvider>,
  );
}

describe('LocationsExplorer', () => {
  it('muestra el conteo de profesionales encontrados luego de buscar', async () => {
    // Arrange
    const user = userEvent.setup();
    renderExplorer();
    await screen.findByText('Profesionales en línea');

    // Act
    await user.click(screen.getByRole('button', { name: 'Buscar' }));

    // Assert
    expect(
      await screen.findByText('2 profesional(es) encontrados.'),
    ).toBeInTheDocument();
  });
});
