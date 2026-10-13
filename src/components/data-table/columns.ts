import type { ColumnDef, RowData } from '@tanstack/react-table';
import type { ReactNode } from 'react';

declare module '@tanstack/react-table' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    // Clases extra para <th> y <td> de la columna (alineación, ancho).
    className?: string;
  }
}

// Columna de acciones estándar: sin ordenamiento, alineada a la derecha y ajustada a su contenido.
export function createActionsColumn<TData>({
  header = '',
  cell,
}: {
  header?: ReactNode;
  cell: (row: TData) => ReactNode;
}): ColumnDef<TData, unknown> {
  return {
    id: 'actions',
    header: () => header,
    cell: ({ row }) => cell(row.original),
    enableSorting: false,
    meta: { className: 'w-px text-right' },
  };
}
