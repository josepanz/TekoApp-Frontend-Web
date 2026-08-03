import { render, screen } from '@/test/render';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { NearbyProfessional } from '../api';
import { LocationsMap } from './locations-map';

// jsdom no puede cargar el script real de Google Maps (Base UI ya nos enseñó que interacciones
// pesadas de librerías externas no se testean bien acá — ver users-table/user-menu) — se mockea
// el módulo entero con stubs livianos que solo exponen lo necesario para verificar el wiring.
vi.mock('@vis.gl/react-google-maps', () => ({
  APIProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="api-provider">{children}</div>
  ),
  Map: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="map">{children}</div>
  ),
  Marker: ({ title }: { title: string }) => (
    <div data-testid="marker">{title}</div>
  ),
}));

const professionals: NearbyProfessional[] = [
  {
    id: 1,
    referenceId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    categoryId: 2,
    currentLatitude: -25.2637,
    currentLongitude: -57.5759,
    isAvailable: true,
    isOnline: true,
    averageRating: 4.8,
    totalRatings: 35,
    distance: 1.2,
  },
  {
    id: 2,
    referenceId: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
    categoryId: 3,
    currentLatitude: null,
    currentLongitude: null,
    isAvailable: false,
    isOnline: false,
    averageRating: 3,
    totalRatings: 1,
  },
];

describe('LocationsMap', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('muestra un mensaje si falta la API key de Google Maps', () => {
    // Arrange
    vi.stubEnv('NEXT_PUBLIC_GOOGLE_MAPS_API_KEY', '');

    // Act
    render(
      <LocationsMap
        professionals={professionals}
        center={{ latitude: -25.2637, longitude: -57.5759 }}
      />,
    );

    // Assert
    expect(
      screen.getByText(/Falta configurar NEXT_PUBLIC_GOOGLE_MAPS_API_KEY/),
    ).toBeInTheDocument();
  });

  it('renderiza un marcador solo para los profesionales con coordenadas conocidas', () => {
    // Arrange
    vi.stubEnv('NEXT_PUBLIC_GOOGLE_MAPS_API_KEY', 'fake-key');

    // Act
    render(
      <LocationsMap
        professionals={professionals}
        center={{ latitude: -25.2637, longitude: -57.5759 }}
      />,
    );

    // Assert
    expect(screen.getAllByTestId('marker')).toHaveLength(1);
  });
});
