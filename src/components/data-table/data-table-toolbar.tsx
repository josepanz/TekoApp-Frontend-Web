'use client';

import { SearchIcon, XIcon } from 'lucide-react';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useDebouncedValue } from '@/hooks/use-debounced-value';
import { cn } from '@/lib/utils';

interface DataTableToolbarProps {
  children?: ReactNode;
  className?: string;
}

// Contenedor del slot `toolbar` de DataTable: búsqueda a la izquierda, filtros/acciones a la
// derecha, en una fila que wrappea en mobile.
export function DataTableToolbar({
  children,
  className,
}: DataTableToolbarProps) {
  return (
    <div
      data-slot="data-table-toolbar"
      className={cn('flex flex-wrap items-center gap-2', className)}
    >
      {children}
    </div>
  );
}

interface DataTableSearchProps {
  // Valor ya debounceado que el caller usa en su query (o '' = sin búsqueda).
  value: string;
  onSearchChange: (value: string) => void;
  placeholder?: string;
  ariaLabel?: string;
  clearLabel?: string;
  debounceMs?: number;
  className?: string;
}

// Input de búsqueda con debounce: mantiene el texto tipeado local y solo notifica al caller
// `debounceMs` después de la última tecla — así no se dispara una query por carácter.
export function DataTableSearch({
  value,
  onSearchChange,
  placeholder = 'Buscar…',
  ariaLabel = 'Buscar',
  clearLabel = 'Limpiar búsqueda',
  debounceMs = 300,
  className,
}: DataTableSearchProps) {
  const [text, setText] = useState(value);
  const debounced = useDebouncedValue(text, debounceMs);
  const onChangeRef = useRef(onSearchChange);
  const lastEmitted = useRef(value);

  useEffect(() => {
    onChangeRef.current = onSearchChange;
  });

  useEffect(() => {
    if (debounced !== lastEmitted.current) {
      lastEmitted.current = debounced;
      onChangeRef.current(debounced);
    }
  }, [debounced]);

  return (
    <div className={cn('relative w-full max-w-xs', className)}>
      <SearchIcon
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
      />
      <Input
        type="search"
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder={placeholder}
        aria-label={ariaLabel}
        className="pr-8 pl-8"
      />
      {text && (
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          aria-label={clearLabel}
          className="absolute top-1/2 right-1 -translate-y-1/2"
          onClick={() => {
            setText('');
            lastEmitted.current = '';
            onChangeRef.current('');
          }}
        >
          <XIcon />
        </Button>
      )}
    </div>
  );
}
