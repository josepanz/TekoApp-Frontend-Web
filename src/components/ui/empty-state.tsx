import { InboxIcon, SearchXIcon, TriangleAlertIcon } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type * as React from 'react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type EmptyStateVariant = 'empty' | 'no-results' | 'error';

const DEFAULT_ICON: Record<EmptyStateVariant, LucideIcon> = {
  empty: InboxIcon,
  'no-results': SearchXIcon,
  error: TriangleAlertIcon,
};

interface EmptyStateAction {
  label: string;
  onClick: () => void;
}

interface EmptyStateProps extends Omit<React.ComponentProps<'div'>, 'title'> {
  // `empty`: aún no hay datos (CTA para crear). `no-results`: hay datos pero el filtro no matchea
  // (CTA para limpiar filtros). `error`: falló la carga (CTA para reintentar, se anuncia con
  // role="alert").
  variant?: EmptyStateVariant;
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: EmptyStateAction;
}

function EmptyState({
  variant = 'empty',
  icon,
  title,
  description,
  action,
  className,
  ...props
}: EmptyStateProps) {
  const Icon = icon ?? DEFAULT_ICON[variant];
  const isError = variant === 'error';

  return (
    <div
      data-slot="empty-state"
      data-variant={variant}
      role={isError ? 'alert' : 'status'}
      className={cn(
        'flex flex-col items-center justify-center gap-3 px-6 py-12 text-center',
        className,
      )}
      {...props}
    >
      <div
        className={cn(
          'flex size-10 items-center justify-center rounded-full bg-muted text-muted-foreground',
          isError && 'bg-destructive/10 text-destructive',
        )}
      >
        <Icon aria-hidden className="size-5" />
      </div>
      <div className="flex max-w-sm flex-col gap-1">
        <p className="text-sm font-medium text-foreground">{title}</p>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {action && (
        <Button
          variant={variant === 'empty' ? 'default' : 'outline'}
          size="sm"
          onClick={action.onClick}
        >
          {action.label}
        </Button>
      )}
    </div>
  );
}

export { EmptyState };
export type { EmptyStateAction, EmptyStateProps, EmptyStateVariant };
