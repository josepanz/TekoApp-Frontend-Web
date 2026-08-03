import { render, screen } from '@/test/render';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { NearbySearchForm } from './nearby-search-form';

describe('NearbySearchForm', () => {
  it('envía los valores por defecto al hacer click en Buscar', async () => {
    // Arrange
    const user = userEvent.setup();
    const onSearch = vi.fn();
    render(<NearbySearchForm onSearch={onSearch} />);

    // Act
    await user.click(screen.getByRole('button', { name: 'Buscar' }));

    // Assert — react-hook-form's handleSubmit siempre invoca el callback con (data, event),
    // aunque la prop `onSearch` solo declare un parámetro — el segundo argumento hay que matchearlo también.
    expect(onSearch).toHaveBeenCalledWith(
      expect.objectContaining({
        latitude: -25.2637,
        longitude: -57.5759,
        radius: 10,
        availableOnly: false,
        onlineOnly: false,
      }),
      expect.anything(),
    );
  });

  it('marca "Solo disponibles" y lo incluye en el envío', async () => {
    // Arrange
    const user = userEvent.setup();
    const onSearch = vi.fn();
    render(<NearbySearchForm onSearch={onSearch} />);

    // Act — Base UI Checkbox renderiza un input nativo oculto (aria-hidden) MÁS un
    // <span role="checkbox">; `getByLabelText` matchea ambos por el `for`/`aria-labelledby`,
    // así que hay que apuntar puntualmente al rol accesible visible.
    await user.click(
      screen.getByRole('checkbox', { name: 'Solo disponibles' }),
    );
    await user.click(screen.getByRole('button', { name: 'Buscar' }));

    // Assert
    expect(onSearch).toHaveBeenCalledWith(
      expect.objectContaining({ availableOnly: true }),
      expect.anything(),
    );
  });

  it('deshabilita el botón mientras isPending es true', () => {
    // Arrange & Act
    render(<NearbySearchForm onSearch={vi.fn()} isPending />);

    // Assert
    expect(screen.getByRole('button', { name: 'Buscando...' })).toBeDisabled();
  });
});
