import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import type { ColumnDef } from '@tanstack/react-table';
import type { SortingState } from '@tanstack/react-table';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { createActionsColumn } from './columns';
import { DataTable } from './data-table';
import { DataTableSearch, DataTableToolbar } from './data-table-toolbar';

type Professional = {
  id: string;
  name: string;
  service: string;
  status: 'Activo' | 'Pendiente' | 'Bloqueado';
};

const statusVariant = {
  Activo: 'success',
  Pendiente: 'warning',
  Bloqueado: 'destructive',
} as const;

const columns: ColumnDef<Professional>[] = [
  { accessorKey: 'name', header: 'Nombre' },
  { accessorKey: 'service', header: 'Servicio' },
  {
    accessorKey: 'status',
    header: 'Estado',
    cell: ({ row }) => {
      const status = row.original.status;
      return <Badge variant={statusVariant[status]}>{status}</Badge>;
    },
  },
];

const data: Professional[] = [
  { id: '1', name: 'Ana Giménez', service: 'Plomería', status: 'Activo' },
  { id: '2', name: 'Juan Pérez', service: 'Electricidad', status: 'Pendiente' },
  {
    id: '3',
    name: 'María Rodríguez',
    service: 'Pintura',
    status: 'Bloqueado',
  },
];

const meta = {
  title: 'Layout/DataTable',
  component: DataTable,
  tags: ['autodocs'],
} satisfies Meta<typeof DataTable<Professional>>;

export default meta;
// El componente es genérico (DataTable<TData>): tipar la Story contra la instancia concreta hace
// que `args.columns` sea ColumnDef<Professional>[] y no ColumnDef<unknown>[].
type Story = StoryObj<typeof DataTable<Professional>>;

export const Default: Story = {
  args: { columns, data },
};

// Paginación server-side (el backend pagina, no la tabla).
export const WithPagination: Story = {
  args: {
    columns,
    data,
    pagination: { page: 1, totalPages: 5, onPageChange: () => {} },
  },
};

export const Empty: Story = {
  args: {
    columns,
    data: [],
    emptyMessage: 'No hay profesionales para mostrar',
  },
};

// Selección de filas para acciones masivas (ver `BulkActionsBar`) — controlada por el caller,
// igual que `pagination`.
export const WithSelection: Story = {
  render: () => {
    function Wrapper() {
      const [selectedIds, setSelectedIds] = useState<string[]>([]);
      return (
        <DataTable
          columns={columns}
          data={data}
          selection={{
            selectedIds,
            onSelectionChange: setSelectedIds,
            getRowId: (row) => row.id,
          }}
        />
      );
    }
    return <Wrapper />;
  },
};

// Primera carga: skeleton de filas + aria-busy.
export const Loading: Story = {
  args: { columns, data: [], isLoading: true },
};

export const NoResults: Story = {
  args: {
    columns,
    data: [],
    isFiltered: true,
    noResultsState: {
      description: 'Probá con otros términos o quitá los filtros.',
    },
  },
};

export const EmptyWithCta: Story = {
  args: {
    columns,
    data: [],
    emptyMessage: 'Todavía no hay profesionales',
    emptyState: {
      description: 'Cuando se registren, los vas a ver acá.',
      action: { label: 'Invitar profesional', onClick: () => {} },
    },
  },
};

export const ErrorWithRetry: Story = {
  args: { columns, data: [], isError: true, onRetry: () => {} },
};

export const WithToolbarAndActions: Story = {
  render: () => {
    function Wrapper() {
      const [search, setSearch] = useState('');
      const rows = data.filter((row) =>
        row.name.toLowerCase().includes(search.toLowerCase()),
      );
      return (
        <DataTable
          columns={[
            ...columns,
            createActionsColumn<Professional>({
              header: 'Acciones',
              cell: () => (
                <Button variant="outline" size="sm">
                  Ver
                </Button>
              ),
            }),
          ]}
          data={rows}
          isFiltered={search !== ''}
          toolbar={
            <DataTableToolbar>
              <DataTableSearch
                value={search}
                onSearchChange={setSearch}
                placeholder="Buscar profesional…"
              />
            </DataTableToolbar>
          }
        />
      );
    }
    return <Wrapper />;
  },
};

// Ordenamiento manual (server-side): el caller recibe el estado y reordena/refetchea.
export const WithSorting: Story = {
  render: () => {
    function Wrapper() {
      const [sorting, setSorting] = useState<SortingState>([]);
      const sorted = [...data].sort((a, b) => {
        const s = sorting[0];
        if (!s) return 0;
        const cmp = a.name.localeCompare(b.name);
        return s.desc ? -cmp : cmp;
      });
      return (
        <DataTable
          columns={[
            { ...columns[0], enableSorting: true },
            ...columns.slice(1),
          ]}
          data={sorted}
          sorting={{ state: sorting, onSortingChange: setSorting }}
        />
      );
    }
    return <Wrapper />;
  },
};
