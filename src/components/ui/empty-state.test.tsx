import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@/test/render';
import { EmptyState } from './empty-state';

describe('EmptyState', () => {
  it('muestra título y descripción sin CTA por defecto', () => {
    render(<EmptyState title="Sin datos" description="Nada por acá" />);

    expect(screen.getByText('Sin datos')).toBeInTheDocument();
    expect(screen.getByText('Nada por acá')).toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('ejecuta la acción al hacer click en el CTA', async () => {
    const onClick = vi.fn();
    render(<EmptyState title="Vacío" action={{ label: 'Crear', onClick }} />);

    await userEvent
      .setup()
      .click(screen.getByRole('button', { name: 'Crear' }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('la variante error se anuncia con role="alert" y permite reintentar', async () => {
    const onClick = vi.fn();
    render(
      <EmptyState
        variant="error"
        title="Falló"
        action={{ label: 'Reintentar', onClick }}
      />,
    );

    expect(screen.getByRole('alert')).toHaveTextContent('Falló');
    await userEvent
      .setup()
      .click(screen.getByRole('button', { name: 'Reintentar' }));
    expect(onClick).toHaveBeenCalled();
  });

  it('las variantes no-error usan role="status"', () => {
    render(<EmptyState variant="no-results" title="Sin resultados" />);

    expect(screen.getByRole('status')).toHaveAttribute(
      'data-variant',
      'no-results',
    );
  });
});
