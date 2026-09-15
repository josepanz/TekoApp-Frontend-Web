import { render, screen } from '@/test/render';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { BulkActionsBar } from './bulk-actions-bar';

describe('BulkActionsBar', () => {
  it('no renderiza nada cuando no hay filas seleccionadas', () => {
    // Arrange & Act
    render(
      <BulkActionsBar selectedCount={0} onCancel={() => {}}>
        acción
      </BulkActionsBar>,
    );

    // Assert
    expect(screen.queryByRole('toolbar')).not.toBeInTheDocument();
  });

  it('muestra la cantidad de filas seleccionadas en singular', () => {
    // Arrange & Act
    render(
      <BulkActionsBar selectedCount={1} onCancel={() => {}}>
        acción
      </BulkActionsBar>,
    );

    // Assert
    expect(screen.getByText('1 fila seleccionada')).toBeInTheDocument();
  });

  it('muestra la cantidad de filas seleccionadas en plural', () => {
    // Arrange & Act
    render(
      <BulkActionsBar selectedCount={5} onCancel={() => {}}>
        acción
      </BulkActionsBar>,
    );

    // Assert
    expect(screen.getByText('5 filas seleccionadas')).toBeInTheDocument();
  });

  it('llama a onCancel al hacer click en "Cancelar selección"', async () => {
    // Arrange
    const user = userEvent.setup();
    const onCancel = vi.fn();
    render(
      <BulkActionsBar selectedCount={2} onCancel={onCancel}>
        acción
      </BulkActionsBar>,
    );

    // Act
    await user.click(
      screen.getByRole('button', { name: 'Cancelar selección' }),
    );

    // Assert
    expect(onCancel).toHaveBeenCalledOnce();
  });
});
