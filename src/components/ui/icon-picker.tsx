'use client';

import * as React from 'react';
import {
  Wrench,
  Hammer,
  PaintRoller,
  Paintbrush,
  Zap,
  Droplet,
  Home,
  Car,
  Scissors,
  Laptop,
  Camera,
  Utensils,
  Dumbbell,
  HeartPulse,
  Shield,
  Key,
  Lock,
  Truck,
  Package,
  Briefcase,
  GraduationCap,
  BookOpen,
  HardHat,
  Plug,
  Thermometer,
  Wind,
  Flame,
  Leaf,
  TreePine,
  Dog,
  Cat,
  Baby,
  Users,
  User,
  Sparkles,
  ShoppingBag,
  Recycle,
  Bug,
  Hand,
  Brush,
  Ruler,
  Search,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

// Set curado (no el registro completo de lucide-react, que son >1500 íconos e infla el bundle
// sin necesidad) — cubre los rubros reales del marketplace. Mismo criterio de "no barrel exports"
// de rules/typescript.md: imports explícitos, no `import * as icons`.
// Exportado para que cualquier render de solo-lectura de una categoría (tabla, detalle, selector)
// use el mismo catálogo que este picker — una sola fuente de verdad nombre-de-ícono → componente.
export const ICONS: Record<string, LucideIcon> = {
  wrench: Wrench,
  hammer: Hammer,
  'paint-roller': PaintRoller,
  paintbrush: Paintbrush,
  brush: Brush,
  zap: Zap,
  plug: Plug,
  droplet: Droplet,
  home: Home,
  car: Car,
  scissors: Scissors,
  laptop: Laptop,
  camera: Camera,
  utensils: Utensils,
  dumbbell: Dumbbell,
  'heart-pulse': HeartPulse,
  shield: Shield,
  key: Key,
  lock: Lock,
  truck: Truck,
  package: Package,
  briefcase: Briefcase,
  'graduation-cap': GraduationCap,
  'book-open': BookOpen,
  'hard-hat': HardHat,
  thermometer: Thermometer,
  wind: Wind,
  flame: Flame,
  leaf: Leaf,
  'tree-pine': TreePine,
  dog: Dog,
  cat: Cat,
  baby: Baby,
  users: Users,
  user: User,
  sparkles: Sparkles,
  'shopping-bag': ShoppingBag,
  recycle: Recycle,
  bug: Bug,
  hand: Hand,
  ruler: Ruler,
};

const ICON_NAMES = Object.keys(ICONS);

interface IconPickerProps {
  id?: string;
  value?: string;
  onChange: (value: string | undefined) => void;
  disabled?: boolean;
}

// Selector visual de ícono — reemplaza un input de texto libre (antes había que escribir de
// memoria un nombre exacto tipo "wrench-outline", sin garantía de que existiera). El valor
// guardado sigue siendo el string plano del campo `icon`, solo que ahora sale de un catálogo
// fijo — Mobile puede mapear estos mismos nombres cuando implemente su propio render de íconos.
export function IconPicker({ id, value, onChange, disabled }: IconPickerProps) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState('');

  const SelectedIcon = value ? ICONS[value] : undefined;
  const filteredNames = ICON_NAMES.filter((name) =>
    name.includes(search.trim().toLowerCase()),
  );

  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) setSearch('');
      }}
    >
      <PopoverTrigger
        id={id}
        disabled={disabled}
        className={cn(
          'flex h-8 w-full items-center gap-2 rounded-lg border border-input bg-transparent px-2.5 text-sm transition-colors outline-none',
          'focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50',
          'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
        )}
      >
        {SelectedIcon ? (
          <SelectedIcon className="size-4 shrink-0" aria-hidden="true" />
        ) : (
          <Search
            className="text-muted-foreground size-4 shrink-0"
            aria-hidden="true"
          />
        )}
        <span className={cn('truncate', !value && 'text-muted-foreground')}>
          {value ?? 'Elegir ícono'}
        </span>
      </PopoverTrigger>

      <PopoverContent className="w-72">
        <Input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Buscar ícono..."
          aria-label="Buscar ícono"
        />

        <div className="grid max-h-56 grid-cols-6 gap-1 overflow-y-auto">
          {filteredNames.map((name) => {
            const IconComponent = ICONS[name];
            const isSelected = value === name;
            return (
              <button
                key={name}
                type="button"
                onClick={() => {
                  onChange(name);
                  setOpen(false);
                  setSearch('');
                }}
                aria-label={name}
                aria-pressed={isSelected}
                className={cn(
                  'flex size-9 items-center justify-center rounded-md border transition-colors',
                  isSelected
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-transparent text-foreground hover:bg-accent hover:text-accent-foreground',
                )}
              >
                <IconComponent className="size-4" aria-hidden="true" />
              </button>
            );
          })}
          {filteredNames.length === 0 && (
            <p className="text-muted-foreground col-span-6 py-4 text-center text-xs">
              Sin resultados
            </p>
          )}
        </div>

        {value && (
          <button
            type="button"
            onClick={() => {
              onChange(undefined);
              setOpen(false);
            }}
            className="text-muted-foreground hover:text-foreground border-border border-t pt-2 text-xs underline"
          >
            Quitar ícono
          </button>
        )}
      </PopoverContent>
    </Popover>
  );
}
