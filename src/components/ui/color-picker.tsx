'use client';

import * as React from 'react';
import { Check, Palette } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

// Paleta de referencia rápida — un click, sin memorizar hex. El selector de tono nativo (más
// abajo) cubre cualquier color fuera de esta lista; el valor sigue siendo un string hex simple,
// no cambia el contrato de CreateCategoryDto/UpdateCategoryDto.
const PRESET_COLORS = [
  '#28A745',
  '#17BEBB',
  '#0D1B2A',
  '#2ECC71',
  '#27AE60',
  '#1ABC9C',
  '#16A085',
  '#3498DB',
  '#2980B9',
  '#9B59B6',
  '#8E44AD',
  '#E91E63',
  '#E74C3C',
  '#C0392B',
  '#E67E22',
  '#D35400',
  '#F39C12',
  '#F1C40F',
  '#95A5A6',
  '#7F8C8D',
  '#34495E',
  '#607D8B',
  '#795548',
  '#000000',
] as const;

interface ColorPickerProps {
  id?: string;
  value?: string;
  onChange: (value: string | undefined) => void;
  disabled?: boolean;
  'aria-invalid'?: boolean;
}

// Selector visual de color — reemplaza un input de texto crudo (nadie memoriza códigos hex, y
// tipearlos a mano mete errores humanos). Sigue guardando un string hex simple, mismo campo
// `color` de siempre; el selector de tono nativo del navegador (<input type="color">) da control
// fino de matiz sin agregar una librería de color wheel nueva.
export function ColorPicker({
  id,
  value,
  onChange,
  disabled,
  ...ariaProps
}: ColorPickerProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        id={id}
        disabled={disabled}
        aria-invalid={ariaProps['aria-invalid']}
        className={cn(
          'flex h-8 w-full items-center gap-2 rounded-lg border border-input bg-transparent px-2.5 text-sm transition-colors outline-none',
          'focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50',
          'aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20',
          'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
        )}
      >
        {value ? (
          <span
            className="size-4 shrink-0 rounded-full border border-border"
            style={{ backgroundColor: value }}
            aria-hidden="true"
          />
        ) : (
          <Palette
            className="text-muted-foreground size-4 shrink-0"
            aria-hidden="true"
          />
        )}
        <span className={cn('truncate', !value && 'text-muted-foreground')}>
          {value ?? 'Elegir color'}
        </span>
      </PopoverTrigger>

      <PopoverContent className="w-auto">
        <div className="grid grid-cols-6 gap-1.5">
          {PRESET_COLORS.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => {
                onChange(preset);
                setOpen(false);
              }}
              aria-label={`Elegir color ${preset}`}
              className="ring-offset-popover focus-visible:ring-ring relative size-7 shrink-0 rounded-full border border-border transition-transform hover:scale-110 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
              style={{ backgroundColor: preset }}
            >
              {value?.toLowerCase() === preset.toLowerCase() && (
                <Check
                  className="absolute inset-0 m-auto size-4 text-white mix-blend-difference"
                  aria-hidden="true"
                />
              )}
            </button>
          ))}
        </div>

        <div className="border-border flex items-center gap-2 border-t pt-2.5">
          <label
            htmlFor={id ? `${id}-native` : undefined}
            className="relative size-7 shrink-0 cursor-pointer overflow-hidden rounded-full border border-border"
          >
            <span
              className="absolute inset-0"
              style={{ backgroundColor: value || '#ffffff' }}
              aria-hidden="true"
            />
            <input
              id={id ? `${id}-native` : undefined}
              type="color"
              value={
                value && /^#[0-9a-fA-F]{6}$/.test(value) ? value : '#ffffff'
              }
              onChange={(event) => onChange(event.target.value)}
              className="absolute -inset-2 cursor-pointer opacity-0"
              aria-label="Elegir tono personalizado"
            />
          </label>
          <span className="text-muted-foreground text-xs">
            Tono personalizado
          </span>
          {value && (
            <button
              type="button"
              onClick={() => {
                onChange(undefined);
                setOpen(false);
              }}
              className="text-muted-foreground hover:text-foreground ml-auto text-xs underline"
            >
              Quitar
            </button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
