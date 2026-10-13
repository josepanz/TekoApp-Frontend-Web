'use client';

import {
  type Column,
  type ColumnDef,
  type RowSelectionState,
  type SortingState,
  type Updater,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import {
  ArrowDownIcon,
  ArrowUpDownIcon,
  ArrowUpIcon,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useMemo, useState, type ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { EmptyState, type EmptyStateProps } from '@/components/ui/empty-state';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from '@/components/ui/pagination';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';

export interface DataTableSelection<TData> {
  selectedIds: string[];
  onSelectionChange: (ids: string[]) => void;
  getRowId: (row: TData) => string;
}

// Ordenamiento controlado por el caller y SIEMPRE manual (server-side). Solo las columnas con
// `enableSorting: true` explícito muestran el botón de orden — cablearlo únicamente donde el
// endpoint acepte un parámetro de orden.
export interface DataTableSorting {
  state: SortingState;
  onSortingChange: (sorting: SortingState) => void;
}

export interface DataTableLabels {
  pageOf: (page: number, totalPages: number) => string;
  previousPage: string;
  nextPage: string;
  selectAll: string;
  selectRow: string;
  loadError: string;
  retry: string;
  noResults: string;
  empty: string;
}

const DEFAULT_LABELS: DataTableLabels = {
  pageOf: (page, totalPages) => `Página ${page} de ${totalPages}`,
  previousPage: 'Página anterior',
  nextPage: 'Página siguiente',
  selectAll: 'Seleccionar todas las filas de esta página',
  selectRow: 'Seleccionar fila',
  loadError: 'No se pudieron cargar los datos',
  retry: 'Reintentar',
  noResults: 'Sin resultados',
  empty: 'No hay datos para mostrar',
};

type EmptyStateContent = Pick<
  EmptyStateProps,
  'title' | 'description' | 'icon' | 'action'
>;

export interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  // Atajo para el título del estado vacío (también sirve de título para "sin resultados"); `emptyState` permite ícono/descripción/CTA.
  emptyMessage?: string;
  emptyState?: Partial<EmptyStateContent>;
  // Con `isFiltered` y sin filas se muestra la variante "sin resultados" en vez de "vacío".
  isFiltered?: boolean;
  noResultsState?: Partial<EmptyStateContent>;
  // Primera carga (sin datos todavía): muestra skeleton de filas.
  isLoading?: boolean;
  // Refetch con datos previos en pantalla (`placeholderData`): atenúa y marca aria-busy.
  isFetching?: boolean;
  isError?: boolean;
  errorMessage?: string;
  onRetry?: () => void;
  skeletonRows?: number;
  // Slot sobre la tabla: búsqueda con debounce + filtros (ver `DataTableToolbar`).
  toolbar?: ReactNode;
  pagination?: {
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
  };
  // Selección de filas de la página actual (para acciones masivas) — controlada por el caller,
  // igual que `pagination`. No selecciona entre páginas: el server pagina, así que "seleccionar
  // todo" solo tiene sentido sobre lo que ya está en el DOM.
  selection?: DataTableSelection<TData>;
  sorting?: DataTableSorting;
  labels?: Partial<DataTableLabels>;
  'aria-label'?: string;
  // Alto máximo del área scrolleable (el header queda sticky dentro de ella).
  maxHeightClassName?: string;
}

function buildSelectionColumn<TData, TValue>(
  selectAllLabel: string,
  selectRowLabel: string,
): ColumnDef<TData, TValue> {
  return {
    id: '__select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        indeterminate={
          table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected()
        }
        onCheckedChange={(checked) => table.toggleAllPageRowsSelected(checked)}
        aria-label={selectAllLabel}
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(checked) => row.toggleSelected(checked)}
        aria-label={selectRowLabel}
      />
    ),
  };
}

function ariaSortFor<TData, TValue>(
  column: Column<TData, TValue>,
  sortingEnabled: boolean,
): 'ascending' | 'descending' | 'none' | undefined {
  if (!sortingEnabled || column.columnDef.enableSorting !== true) {
    return undefined;
  }
  const sorted = column.getIsSorted();
  if (sorted === 'asc') return 'ascending';
  if (sorted === 'desc') return 'descending';
  return 'none';
}

// Wrapper reutilizable sobre TanStack Table — paginación y ordenamiento siempre manuales/server-side
// (el backend pagina y ordena, no la tabla). Reusar este componente para cada dominio nuevo en vez
// de armar una tabla desde cero por feature.
export function DataTable<TData, TValue = unknown>({
  columns,
  data,
  emptyMessage,
  emptyState,
  isFiltered = false,
  noResultsState,
  isLoading = false,
  isFetching = false,
  isError = false,
  errorMessage,
  onRetry,
  skeletonRows = 5,
  toolbar,
  pagination,
  selection,
  sorting,
  labels: labelOverrides,
  'aria-label': ariaLabel,
  maxHeightClassName = 'max-h-[70vh]',
}: DataTableProps<TData, TValue>) {
  const labels: DataTableLabels = { ...DEFAULT_LABELS, ...labelOverrides };

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
  // TanStack, no el closure) — memoizarla le da al `cell`/`header` una referencia de función
  // ESTABLE entre renders. `flexRender` trata cualquier función como componente React
  // (`React.createElement`), así que una referencia nueva en cada render desmonta y remonta el
  // checkbox — perdiendo el click de la fila que se acaba de tocar en cuanto el padre vuelve a
  // renderizar. Las deps son strings (no el objeto `labels`) justamente para eso.
  const { selectAll, selectRow } = labels;
  const selectionColumn = useMemo(
    () => buildSelectionColumn<TData, TValue>(selectAll, selectRow),
    [selectAll, selectRow],
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
    manualSorting: true,
    state: {
      ...(selection ? { rowSelection } : {}),
      ...(sorting ? { sorting: sorting.state } : {}),
    },
    onRowSelectionChange: selection
      ? (updater: Updater<RowSelectionState>) => {
          const next =
            typeof updater === 'function' ? updater(rowSelection) : updater;
          selection.onSelectionChange(
            Object.keys(next).filter((id) => next[id]),
          );
        }
      : undefined,
    onSortingChange: sorting
      ? (updater: Updater<SortingState>) => {
          sorting.onSortingChange(
            typeof updater === 'function' ? updater(sorting.state) : updater,
          );
        }
      : undefined,
  });

  const rows = table.getRowModel().rows;
  const showSkeleton = isLoading && !isError;
  const showError = isError;
  const showEmpty = !isLoading && !isError && rows.length === 0;
  const busy = isLoading || isFetching;

  function renderStateRow(content: ReactNode) {
    return (
      <TableRow className="hover:bg-transparent">
        <TableCell
          colSpan={tableColumns.length}
          className="p-0 whitespace-normal"
        >
          {content}
        </TableCell>
      </TableRow>
    );
  }

  function renderEmpty() {
    if (isFiltered) {
      return (
        <EmptyState
          variant="no-results"
          title={emptyMessage ?? labels.noResults}
          className="py-8"
          {...noResultsState}
        />
      );
    }
    return (
      <EmptyState
        variant="empty"
        title={emptyMessage ?? labels.empty}
        className="py-8"
        {...emptyState}
      />
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {toolbar}

      <div className="overflow-hidden rounded-md border">
        <Table
          aria-label={ariaLabel}
          aria-busy={busy}
          containerClassName={cn('overflow-y-auto', maxHeightClassName)}
          className={cn(isFetching && !isLoading && 'opacity-60')}
        >
          <TableHeader className="sticky top-0 z-10 bg-background shadow-[0_1px_0_var(--border)]">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const column = header.column;
                  const sortable =
                    !!sorting &&
                    column.columnDef.enableSorting === true &&
                    column.getCanSort();
                  const sorted = column.getIsSorted();
                  return (
                    <TableHead
                      key={header.id}
                      scope="col"
                      aria-sort={ariaSortFor(column, !!sorting)}
                      className={column.columnDef.meta?.className}
                    >
                      {header.isPlaceholder ? null : sortable ? (
                        <button
                          type="button"
                          onClick={() => column.toggleSorting(sorted === 'asc')}
                          className="-ml-1 inline-flex items-center gap-1 rounded px-1 py-0.5 outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50"
                        >
                          {flexRender(
                            column.columnDef.header,
                            header.getContext(),
                          )}
                          {sorted === 'asc' ? (
                            <ArrowUpIcon aria-hidden className="size-3.5" />
                          ) : sorted === 'desc' ? (
                            <ArrowDownIcon aria-hidden className="size-3.5" />
                          ) : (
                            <ArrowUpDownIcon
                              aria-hidden
                              className="size-3.5 text-muted-foreground"
                            />
                          )}
                        </button>
                      ) : (
                        flexRender(column.columnDef.header, header.getContext())
                      )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {showSkeleton &&
              Array.from({ length: skeletonRows }, (_, rowIndex) => (
                <TableRow
                  key={`skeleton-${rowIndex}`}
                  data-slot="data-table-skeleton-row"
                  className="hover:bg-transparent"
                >
                  {tableColumns.map((column, colIndex) => (
                    <TableCell key={column.id ?? colIndex}>
                      <Skeleton className="h-4 w-full max-w-40" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}

            {showError &&
              renderStateRow(
                <EmptyState
                  variant="error"
                  title={errorMessage ?? labels.loadError}
                  className="py-8"
                  action={
                    onRetry
                      ? { label: labels.retry, onClick: onRetry }
                      : undefined
                  }
                />,
              )}

            {showEmpty && renderStateRow(renderEmpty())}

            {!showSkeleton &&
              !showError &&
              rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() ? 'selected' : undefined}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={cell.column.columnDef.meta?.className}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>

      {pagination && pagination.totalPages > 1 && (
        <Pagination className="mx-0 justify-end">
          <PaginationContent className="gap-2">
            <PaginationItem>
              <span className="text-sm text-muted-foreground">
                {labels.pageOf(pagination.page, pagination.totalPages)}
              </span>
            </PaginationItem>
            <PaginationItem>
              <Button
                variant="outline"
                size="icon"
                disabled={pagination.page <= 1}
                onClick={() => pagination.onPageChange(pagination.page - 1)}
                aria-label={labels.previousPage}
              >
                <ChevronLeft />
              </Button>
            </PaginationItem>
            <PaginationItem>
              <Button
                variant="outline"
                size="icon"
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => pagination.onPageChange(pagination.page + 1)}
                aria-label={labels.nextPage}
              >
                <ChevronRight />
              </Button>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
