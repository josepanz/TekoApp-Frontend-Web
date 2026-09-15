'use client';

import {
  type ColumnDef,
  type RowSelectionState,
  type Updater,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface DataTableSelection<TData> {
  selectedIds: string[];
  onSelectionChange: (ids: string[]) => void;
  getRowId: (row: TData) => string;
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  emptyMessage?: string;
  pagination?: {
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
  };
  // Selección de filas de la página actual (para acciones masivas) — controlada por el caller,
  // igual que `pagination`. No selecciona entre páginas: el server pagina, así que "seleccionar
  // todo" solo tiene sentido sobre lo que ya está en el DOM.
  selection?: DataTableSelection<TData>;
}

function buildSelectionColumn<TData, TValue>(): ColumnDef<TData, TValue> {
  return {
    id: '__select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        indeterminate={
          table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected()
        }
        onCheckedChange={(checked) => table.toggleAllPageRowsSelected(checked)}
        aria-label="Seleccionar todas las filas de esta página"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(checked) => row.toggleSelected(checked)}
        aria-label="Seleccionar fila"
      />
    ),
  };
}

// Wrapper reutilizable sobre TanStack Table — paginación siempre manual/server-side (el backend
// pagina, no la tabla). Reusar este componente para cada dominio nuevo (Fase 4 del plan) en vez
// de armar una tabla desde cero por feature.
export function DataTable<TData, TValue = unknown>({
  columns,
  data,
  emptyMessage = 'No hay datos para mostrar',
  pagination,
  selection,
}: DataTableProps<TData, TValue>) {
  const rowSelection: RowSelectionState = useMemo(
    () =>
      Object.fromEntries(
        (selection?.selectedIds ?? []).map((id) => [id, true]),
      ),
    [selection?.selectedIds],
  );

  // Memoizado una sola vez: crear una instancia nueva en cada render (como estaba antes de la
  // selección de filas) resetea el caché interno de TanStack Table y provoca que las filas se
  // remonten en cada cambio de estado — perdiendo el foco/referencia del checkbox que se acaba de
  // clickear.
  const [coreRowModel] = useState(() => getCoreRowModel<TData>());

  // `buildSelectionColumn` no depende de `selection` (usa `table`/`row` del contexto de
  // TanStack, no el closure) — memoizarla con deps vacías le da al `cell`/`header` una
  // referencia de función ESTABLE entre renders. `flexRender` trata cualquier función como
  // componente React (`React.createElement`), así que una referencia nueva en cada render
  // desmonta y remonta el checkbox — perdiendo el click de la fila que se acaba de tocar en
  // cuanto el padre vuelve a renderizar (p. ej. al seleccionar la fila siguiente).
  const selectionColumn = useMemo(
    () => buildSelectionColumn<TData, TValue>(),
    [],
  );

  const tableColumns = useMemo<ColumnDef<TData, TValue>[]>(
    () => (selection ? [selectionColumn, ...columns] : columns),
    [selection, columns, selectionColumn],
  );

  // TanStack Table es una incompatibilidad conocida y aceptada del React Compiler (devuelve
  // funciones que no se pueden memoizar de forma segura) — no es un bug real de este componente.
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns: tableColumns,
    getCoreRowModel: coreRowModel,
    getRowId: selection ? (row: TData) => selection.getRowId(row) : undefined,
    enableRowSelection: !!selection,
    state: selection ? { rowSelection } : undefined,
    onRowSelectionChange: selection
      ? (updater: Updater<RowSelectionState>) => {
          const next =
            typeof updater === 'function' ? updater(rowSelection) : updater;
          selection.onSelectionChange(
            Object.keys(next).filter((id) => next[id]),
          );
        }
      : undefined,
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={tableColumns.length}
                  className="text-muted-foreground h-24 text-center"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-end gap-2">
          <span className="text-muted-foreground text-sm">
            Página {pagination.page} de {pagination.totalPages}
          </span>
          <Button
            variant="outline"
            size="icon"
            disabled={pagination.page <= 1}
            onClick={() => pagination.onPageChange(pagination.page - 1)}
            aria-label="Página anterior"
          >
            <ChevronLeft />
          </Button>
          <Button
            variant="outline"
            size="icon"
            disabled={pagination.page >= pagination.totalPages}
            onClick={() => pagination.onPageChange(pagination.page + 1)}
            aria-label="Página siguiente"
          >
            <ChevronRight />
          </Button>
        </div>
      )}
    </div>
  );
}
