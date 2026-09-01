import { Tag, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ICONS } from '@/components/ui/icon-picker';

interface CategoryIconProps {
  icon?: string | null;
  color?: string | null;
  className?: string;
}

// Ícono real de la categoría (mismo catálogo curado que `IconPicker`), en su color de marca —
// antes cualquier lugar fuera de `/admin/categories` solo mostraba el nombre de texto plano de la
// categoría, sin ícono ni color (ver PENDING.md, "Íconos de categoría").
export function CategoryIcon({ icon, color, className }: CategoryIconProps) {
  const IconComponent: LucideIcon = (icon && ICONS[icon]) || Tag;
  return (
    <IconComponent
      className={cn('size-4 shrink-0', className)}
      style={color ? { color } : undefined}
      aria-hidden="true"
    />
  );
}

interface CategoryLabelProps extends CategoryIconProps {
  name: string;
}

// Ícono + nombre juntos — usar en cualquier lugar donde hoy se muestra `category.name` solo.
export function CategoryLabel({
  name,
  icon,
  color,
  className,
}: CategoryLabelProps) {
  return (
    <span className={cn('inline-flex items-center gap-1.5', className)}>
      <CategoryIcon icon={icon} color={color} />
      <span>{name}</span>
    </span>
  );
}
