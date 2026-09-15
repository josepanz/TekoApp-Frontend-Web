import type { ColumnDef } from '@tanstack/react-table';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it } from 'vitest';
import { render, screen } from '@/test/render';
import { DataTable } from './data-table';

type Row = { id: string; name: string };

const columns: ColumnDef<Row>[] = [{ accessorKey: 'name', header: 'Nombre' }];
const data: Row[] = [
  { id: '1', name: 'Ana' },
  { id: '2', name: 'Juan' },
];

function SelectableTable() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  return (
    <>
      <span data-testid="selected-count">{selectedIds.length}</span>
      <DataTable
        columns={columns}
        data={data}
        selection={{
          selectedIds,
          onSelectionChange: setSelectedIds,
          getRowId: (row) => row.id,
        }}
      />
    </>
  );
}

describe('DataTable — selección de filas', () => {
  it('no muestra columna de selección cuando no se pasa `selection`', () => {
    // Arrange & Act
    render(<DataTable columns={columns} data={data} />);

    // Assert
    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
  });

  it('selecciona una fila individual y lo refleja en el estado del caller', async () => {
    // Arrange
    const user = userEvent.setup();
    render(<SelectableTable />);

    // Act
    await user.click(
      screen.getAllByRole('checkbox', {
        name: 'Seleccionar fila',
      })[0],
    );

    // Assert
    expect(screen.getByTestId('selected-count')).toHaveTextContent('1');
  });

  it('el checkbox del header selecciona todas las filas visibles', async () => {
    // Arrange
    const user = userEvent.setup();
    render(<SelectableTable />);

    // Act
    await user.click(
      screen.getByRole('checkbox', {
        name: 'Seleccionar todas las filas de esta página',
      }),
    );

    // Assert
    expect(screen.getByTestId('selected-count')).toHaveTextContent('2');
  });

  it('selecciona dos filas individuales en clicks sucesivos usando la misma referencia', async () => {
    // Arrange
    const user = userEvent.setup();
    render(<SelectableTable />);
    const rowCheckboxes = screen.getAllByRole('checkbox', {
      name: 'Seleccionar fila',
    });

    // Act
    await user.click(rowCheckboxes[0]);
    await user.click(rowCheckboxes[1]);

    // Assert
    expect(screen.getByTestId('selected-count')).toHaveTextContent('2');
  });

  it('deseleccionar una fila desmarca el checkbox de "seleccionar todo"', async () => {
    // Arrange
    const user = userEvent.setup();
    render(<SelectableTable />);
    const selectAll = screen.getByRole('checkbox', {
      name: 'Seleccionar todas las filas de esta página',
    });
    await user.click(selectAll);

    // Act
    await user.click(
      screen.getAllByRole('checkbox', { name: 'Seleccionar fila' })[0],
    );

    // Assert
    expect(selectAll).not.toBeChecked();
    expect(screen.getByTestId('selected-count')).toHaveTextContent('1');
  });
});
