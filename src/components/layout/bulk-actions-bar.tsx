'use client';

import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';

interface BulkActionsBarProps {
  selectedCount: number;
  onCancel: () => void;
  // Botones de acción del caller (uno por acción masiva disponible en esa tabla).
  children: ReactNode;
}

// Barra genérica de acciones masivas — aparece sobre `DataTable` cuando `selection.selectedIds`
// tiene al menos un elemento. No sabe nada de qué acción ejecuta: eso lo decide el caller vía
// `children`. Ver `openspec/specs/admin-bulk-actions.md`.
export function BulkActionsBar({
  selectedCount,
  onCancel,
  children,
}: BulkActionsBarProps) {
  if (selectedCount === 0) return null;

  return (
    <div
      role="toolbar"
      aria-label="Acciones masivas"
      aria-live="polite"
      className="flex flex-wrap items-center gap-3 rounded-md border bg-muted/50 px-4 py-2"
    >
      <span className="text-sm font-medium">
        {selectedCount === 1
          ? '1 fila seleccionada'
          : `${selectedCount} filas seleccionadas`}
      </span>
      <div className="flex flex-wrap items-center gap-2">{children}</div>
      <Button variant="ghost" size="sm" onClick={onCancel} className="ml-auto">
        Cancelar selección
      </Button>
    </div>
  );
}
