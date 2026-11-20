/**
 * Suite: LocationPickerMap (mapa Leaflet para elegir la ubicacion del servicio)
 * Casos: CP-WEB-A11Y-013 (ver test/qa/casos/CP-A11Y.md)
 * Tipo: unitaria (componente) + a11y   Prioridad: P2
 * Precondiciones: Leaflet real sobre jsdom; sin backend.
 * Trazabilidad: DEF-WEB-009 (axe `aria-hidden-focus`: contenedor `aria-hidden` con contenido focusable).
 */
import { render, screen } from '@/test/render';
import { describe, expect, it } from 'vitest';
import { LocationPickerMap } from './location-picker-map';

describe('LocationPickerMap', () => {
  it('CP-WEB-A11Y-013 expone el mapa como grupo con nombre accesible y sin aria-hidden', () => {
    // Arrange & Act
    const { container } = render(
      <LocationPickerMap
        latitude={-25.2637}
        longitude={-57.5759}
        onChange={() => {}}
      />,
    );

    // Assert: el contenedor no oculta contenido focusable (tabindex del mapa, marcador y zoom)
    const group = screen.getByRole('group', {
      name: /Mapa para elegir la ubicación/,
    });
    expect(group).not.toHaveAttribute('aria-hidden');
    expect(
      container.querySelector('[aria-hidden="true"][tabindex]'),
    ).toBeNull();
  });
});
