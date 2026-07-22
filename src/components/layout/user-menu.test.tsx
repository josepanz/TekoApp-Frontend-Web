import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { UserMenu } from './user-menu';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
}));

// La interacción real de abrir el popup y clickear "Cerrar sesión" se cubre en
// e2e/login.spec.ts contra un browser real — los popups de Base UI dependen de Floating UI
// (medición de layout real) que jsdom no reproduce de forma confiable. Acá solo se verifica
// que el trigger renderiza correctamente (nombre, iniciales, accesibilidad).
describe('UserMenu', () => {
  it('renderiza el botón del menú con el nombre del usuario', () => {
    // Arrange & Act
    render(<UserMenu name="Ana Test" email="ana@tekoapp.com.py" />);

    // Assert
    expect(
      screen.getByRole('button', { name: 'Menú de usuario' }),
    ).toBeInTheDocument();
    expect(screen.getByText('Ana Test')).toBeInTheDocument();
    expect(screen.getByText('AT')).toBeInTheDocument();
  });
});
