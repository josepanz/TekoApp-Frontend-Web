/**
 * Suite: DataTable: selección, estados (skeleton/vacío/sin resultados/error), paginación, toolbar con debounce y ordenamiento (aria-sort)
 * Casos: CP-WEB-UI-001..011 (ver test/qa/casos/CP-UI.md)
 * Tipo: unitaria (componente)   Prioridad: P1
 * Precondiciones: Vitest + jsdom + user-event; sin red.
 * Trazabilidad: rama feat/admin-ui-datatable-emptystate, commit d1c7bfd
 */
import type { ColumnDef } from '@tanstack/react-table';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@/test/render';
import { DataTable } from './data-table';
import { DataTableSearch, DataTableToolbar } from './data-table-toolbar';
import { createActionsColumn } from './columns';

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

describe('DataTable — estados', () => {
  it('muestra skeleton de filas y aria-busy mientras carga', () => {
    const { container } = render(
      <DataTable columns={columns} data={[]} isLoading skeletonRows={3} />,
    );

    expect(
      container.querySelectorAll('[data-slot="data-table-skeleton-row"]'),
    ).toHaveLength(3);
    expect(screen.getByRole('table')).toHaveAttribute('aria-busy', 'true');
  });

  it('marca aria-busy al refrescar con datos previos', () => {
    render(<DataTable columns={columns} data={data} isFetching />);

    expect(screen.getByRole('table')).toHaveAttribute('aria-busy', 'true');
    expect(screen.getByText('Ana')).toBeInTheDocument();
  });

  it('muestra el estado vacío con el mensaje indicado', () => {
    render(<DataTable columns={columns} data={[]} emptyMessage="Nada acá" />);

    expect(screen.getByText('Nada acá')).toBeInTheDocument();
    expect(screen.getByRole('table')).toHaveAttribute('aria-busy', 'false');
  });

  it('muestra "sin resultados" cuando hay filtros activos', () => {
    render(<DataTable columns={columns} data={[]} isFiltered />);

    expect(screen.getByText('Sin resultados')).toBeInTheDocument();
  });

  it('muestra el error con botón de reintento', async () => {
    const onRetry = vi.fn();
    render(<DataTable columns={columns} data={[]} isError onRetry={onRetry} />);

    await userEvent
      .setup()
      .click(screen.getByRole('button', { name: 'Reintentar' }));

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(onRetry).toHaveBeenCalledTimes(1);
  });
});

describe('DataTable — paginación y toolbar', () => {
  it('pagina con los botones anterior/siguiente', async () => {
    const onPageChange = vi.fn();
    render(
      <DataTable
        columns={columns}
        data={data}
        pagination={{ page: 2, totalPages: 3, onPageChange }}
      />,
    );
    const user = userEvent.setup();

    await user.click(screen.getByRole('button', { name: 'Página siguiente' }));
    await user.click(screen.getByRole('button', { name: 'Página anterior' }));

    expect(screen.getByText('Página 2 de 3')).toBeInTheDocument();
    expect(onPageChange).toHaveBeenNthCalledWith(1, 3);
    expect(onPageChange).toHaveBeenNthCalledWith(2, 1);
  });

  it('renderiza el slot de toolbar y la búsqueda notifica con debounce', async () => {
    const onSearchChange = vi.fn();
    render(
      <DataTable
        columns={columns}
        data={data}
        toolbar={
          <DataTableToolbar>
            <DataTableSearch
              value=""
              onSearchChange={onSearchChange}
              debounceMs={50}
            />
          </DataTableToolbar>
        }
      />,
    );

    await userEvent.setup().type(screen.getByRole('searchbox'), 'ana');

    expect(onSearchChange).not.toHaveBeenCalledWith('a');
    await waitFor(() => expect(onSearchChange).toHaveBeenCalledWith('ana'));
    expect(onSearchChange).toHaveBeenCalledTimes(1);
  });

  it('renderiza la columna de acciones', () => {
    render(
      <DataTable
        columns={[
          ...columns,
          createActionsColumn<Row>({
            header: 'Acciones',
            cell: (row) => <button type="button">Editar {row.name}</button>,
          }),
        ]}
        data={data}
      />,
    );

    expect(
      screen.getByRole('button', { name: 'Editar Ana' }),
    ).toBeInTheDocument();
  });
});

describe('DataTable — ordenamiento', () => {
  const sortableColumns: ColumnDef<Row>[] = [
    { accessorKey: 'name', header: 'Nombre', enableSorting: true },
    { accessorKey: 'id', header: 'Id' },
  ];

  it('solo las columnas con enableSorting exponen aria-sort y ciclan asc/desc', async () => {
    const onSortingChange = vi.fn();
    const { rerender } = render(
      <DataTable
        columns={sortableColumns}
        data={data}
        sorting={{ state: [], onSortingChange }}
      />,
    );
    const user = userEvent.setup();

    expect(
      screen.getByRole('columnheader', { name: 'Nombre' }),
    ).toHaveAttribute('aria-sort', 'none');
    expect(
      screen.getByRole('columnheader', { name: 'Id' }),
    ).not.toHaveAttribute('aria-sort');

    await user.click(screen.getByRole('button', { name: 'Nombre' }));
    expect(onSortingChange).toHaveBeenLastCalledWith([
      { id: 'name', desc: false },
    ]);

    rerender(
      <DataTable
        columns={sortableColumns}
        data={data}
        sorting={{ state: [{ id: 'name', desc: false }], onSortingChange }}
      />,
    );
    expect(
      screen.getByRole('columnheader', { name: 'Nombre' }),
    ).toHaveAttribute('aria-sort', 'ascending');

    await user.click(screen.getByRole('button', { name: 'Nombre' }));
    expect(onSortingChange).toHaveBeenLastCalledWith([
      { id: 'name', desc: true },
    ]);
  });

  it('sin prop sorting no hay botones de orden ni aria-sort', () => {
    render(<DataTable columns={sortableColumns} data={data} />);

    expect(
      screen.queryByRole('button', { name: 'Nombre' }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole('columnheader', { name: 'Nombre' }),
    ).not.toHaveAttribute('aria-sort');
  });
});
