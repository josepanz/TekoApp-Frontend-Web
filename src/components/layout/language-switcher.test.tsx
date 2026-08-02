import { render, screen } from '@/test/render';
import { describe, expect, it, vi } from 'vitest';
import { LanguageSwitcher } from './language-switcher';

const mockRefresh = vi.fn();
const mockSetLocale = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ refresh: mockRefresh }),
}));

// La Server Action no puede ejecutarse en jsdom (necesita el runtime del servidor de Next),
// así que se mockea el módulo para verificar el contrato del componente.
vi.mock('@/i18n/set-locale-action', () => ({
  setLocale: (locale: string) => mockSetLocale(locale),
}));

// Igual que UserMenu/ThemeToggle: la apertura real del popup de Base UI depende de Floating UI
// (medición de layout que jsdom no reproduce de forma confiable), así que acá se verifica el
// trigger accesible; el cambio de idioma end-to-end se prueba manualmente en el browser.
describe('LanguageSwitcher', () => {
  it('renderiza el botón de cambio de idioma con su nombre accesible', () => {
    // Arrange & Act
    render(<LanguageSwitcher />);

    // Assert
    expect(
      screen.getByRole('button', { name: 'Cambiar idioma' }),
    ).toBeInTheDocument();
  });
});
