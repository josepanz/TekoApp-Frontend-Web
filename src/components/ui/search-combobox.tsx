'use client';

import { Combobox as ComboboxPrimitive } from '@base-ui/react/combobox';
import { CheckIcon, XIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

interface SearchComboboxProps<T> {
  // Resultados YA filtrados por el servidor para el texto de búsqueda actual (el combobox no
  // filtra en cliente: `filter={null}`).
  items: T[];
  value: T | null;
  onValueChange: (value: T | null) => void;
  inputValue: string;
  onInputValueChange: (value: string) => void;
  getKey: (item: T) => string;
  getLabel: (item: T) => string;
  id?: string;
  placeholder?: string;
  ariaLabel?: string;
  clearLabel?: string;
  emptyText: string;
  loadingText?: string;
  isLoading?: boolean;
  className?: string;
}

// Combobox con búsqueda asíncrona (server-side) sobre Base UI. El caller es dueño del texto
// (`inputValue`) y de los `items`: típicamente `inputValue` → debounce → query → `items`.
function SearchCombobox<T>({
  items,
  value,
  onValueChange,
  inputValue,
  onInputValueChange,
  getKey,
  getLabel,
  id,
  placeholder,
  ariaLabel,
  clearLabel = 'Limpiar',
  emptyText,
  loadingText = 'Cargando…',
  isLoading = false,
  className,
}: SearchComboboxProps<T>) {
  return (
    <ComboboxPrimitive.Root<T>
      items={items}
      value={value}
      onValueChange={onValueChange}
      inputValue={inputValue}
      onInputValueChange={onInputValueChange}
      itemToStringLabel={getLabel}
      isItemEqualToValue={(a, b) => getKey(a) === getKey(b)}
      filter={null}
    >
      <div
        data-slot="search-combobox"
        className={cn('relative w-full', className)}
      >
        <ComboboxPrimitive.Input
          id={id}
          placeholder={placeholder}
          aria-label={ariaLabel}
          className="h-8 w-full min-w-0 rounded-lg border border-input bg-transparent py-1 pr-8 pl-2.5 text-base transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:bg-input/30"
        />
        <ComboboxPrimitive.Clear
          aria-label={clearLabel}
          className="absolute top-1/2 right-1.5 flex size-5 -translate-y-1/2 items-center justify-center rounded text-muted-foreground outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50"
        >
          <XIcon className="size-3.5" />
        </ComboboxPrimitive.Clear>
      </div>
      <ComboboxPrimitive.Portal>
        <ComboboxPrimitive.Positioner sideOffset={4} className="isolate z-50">
          <ComboboxPrimitive.Popup
            data-slot="search-combobox-content"
            className="max-h-72 w-(--anchor-width) min-w-48 origin-(--transform-origin) overflow-y-auto rounded-lg bg-popover text-popover-foreground shadow-md ring-1 ring-foreground/10"
          >
            <ComboboxPrimitive.Status className="px-2.5 py-2 text-sm text-muted-foreground empty:hidden">
              {isLoading ? loadingText : null}
            </ComboboxPrimitive.Status>
            {!isLoading && (
              <ComboboxPrimitive.Empty className="px-2.5 py-2 text-sm text-muted-foreground empty:hidden">
                {emptyText}
              </ComboboxPrimitive.Empty>
            )}
            <ComboboxPrimitive.List className="p-1">
              {(item: T) => (
                <ComboboxPrimitive.Item
                  key={getKey(item)}
                  value={item}
                  className="relative flex w-full cursor-default items-center gap-1.5 rounded-md py-1 pr-8 pl-1.5 text-sm outline-hidden select-none data-highlighted:bg-accent data-highlighted:text-accent-foreground"
                >
                  <span className="flex-1 truncate">{getLabel(item)}</span>
                  <ComboboxPrimitive.ItemIndicator className="absolute right-2 flex size-4 items-center justify-center">
                    <CheckIcon className="size-4" />
                  </ComboboxPrimitive.ItemIndicator>
                </ComboboxPrimitive.Item>
              )}
            </ComboboxPrimitive.List>
          </ComboboxPrimitive.Popup>
        </ComboboxPrimitive.Positioner>
      </ComboboxPrimitive.Portal>
    </ComboboxPrimitive.Root>
  );
}

export { SearchCombobox };
export type { SearchComboboxProps };
