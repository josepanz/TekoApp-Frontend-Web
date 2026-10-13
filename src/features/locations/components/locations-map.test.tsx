/**
 * Suite: LocationsMap y toMarkers con el contrato nuevo (coordenadas aproximadas, descarte de inválidas)
 * Casos: CP-WEB-LOC-001..003 (ver test/qa/casos/CP-LOC.md)
 * Tipo: unitaria (componente)   Prioridad: P1
 * Precondiciones: Vitest + jsdom; @vis.gl/react-google-maps mockeado; API key por vi.stubEnv.
 * Trazabilidad: commit 716df29 (mapa alineado al contrato nuevo)
 */
import { render, screen } from '@/test/render';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { NearbyProfessional } from '../api';
import { LocationsMap, toMarkers } from './locations-map';

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
    description: 'Plomero',
    hourlyRate: 50000,
    latitude: -25.2637,
    longitude: -57.5759,
    isAvailable: true,
    isOnline: true,
    averageRating: 4.8,
    distanceKm: 1.2,
  },
  {
    id: 2,
    referenceId: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
    categoryId: 3,
    description: 'Sin posicion',
    hourlyRate: 0,
    // Defensivo: el DTO tipa number, pero se prueba el descarte ante null del backend.
    latitude: null as unknown as number,
    longitude: null as unknown as number,
    distanceKm: 0,
    isAvailable: false,
    isOnline: false,
    averageRating: 3,
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

describe('toMarkers', () => {
  it('mapea latitude/longitude (aproximadas) a posiciones y descarta las invalidas', () => {
    const result = toMarkers([
      ...professionals,
      {
        ...professionals[0],
        id: 3,
        latitude: '-25.3' as unknown as number,
        longitude: 'x' as unknown as number,
      },
      {
        ...professionals[0],
        id: 4,
        latitude: '-25.3' as unknown as number,
        longitude: '-57.6' as unknown as number,
      },
    ]);

    expect(result.map((m) => m.professional.id)).toEqual([1, 4]);
    expect(result[0].position).toEqual({ lat: -25.2637, lng: -57.5759 });
    expect(result[1].position).toEqual({ lat: -25.3, lng: -57.6 });
  });
});
