/**
 * Suite: Button y Badge, variante `default` (estado hover accesible)
 * Casos: CP-WEB-A11Y-016 (ver test/qa/casos/CP-A11Y.md)
 * Tipo: unitaria (componente) + a11y   Prioridad: P2
 * Precondiciones: jsdom (`pnpm test`); el contraste real lo cubre el escaneo axe del e2e.
 * Trazabilidad: DEF-WEB-012 (hover `bg-primary/80` da 3.58:1 con texto blanco en claro, < 4.5:1).
 */
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Badge } from './badge';
import { Button } from './button';

describe('Button y Badge default', () => {
  it('CP-WEB-A11Y-016 el hover del botón primario oscurece el fondo en vez de aclararlo con opacidad', () => {
    // Arrange & Act
    render(<Button>Aceptar</Button>);
    const classes = screen.getByRole('button', { name: 'Aceptar' }).className;

    // Assert: con `bg-primary/80` sobre blanco el texto blanco queda en 3.58:1 (< 4.5:1)
    expect(classes).not.toContain('hover:bg-primary/80');
    expect(classes).toContain(
      'hover:bg-[color-mix(in_oklch,var(--primary),var(--foreground)_15%)]',
    );
  });

  it('CP-WEB-A11Y-016 el badge primario enlazado oscurece en hover con el mismo criterio', () => {
    // Arrange & Act
    render(<Badge>Aprobado</Badge>);
    const classes = screen.getByText('Aprobado').className;

    // Assert
    expect(classes).not.toContain('hover:bg-primary/80');
    expect(classes).toContain(
      '[a]:hover:bg-[color-mix(in_oklch,var(--primary),var(--foreground)_15%)]',
    );
  });
});
