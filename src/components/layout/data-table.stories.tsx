import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import type { ColumnDef } from '@tanstack/react-table';

import { Badge } from '@/components/ui/badge';
import { DataTable } from './data-table';

type Professional = {
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
  { name: 'Ana Giménez', service: 'Plomería', status: 'Activo' },
  { name: 'Juan Pérez', service: 'Electricidad', status: 'Pendiente' },
  { name: 'María Rodríguez', service: 'Pintura', status: 'Bloqueado' },
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
