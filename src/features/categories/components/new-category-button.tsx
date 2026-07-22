'use client';

import { PlusIcon } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CategoryFormDialog } from './category-form-dialog';

// Botón + diálogo de creación separados de CategoriesTable (que solo gestiona edición/borrado
// por fila) para que `app/admin/categories/page.tsx` pueda quedar como un Server Component simple
// que solo compone piezas de `features/categories/components`, sin manejar estado de UI él mismo.
export function NewCategoryButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <PlusIcon />
        Nueva categoría
      </Button>
      <CategoryFormDialog open={open} onOpenChange={setOpen} />
    </>
  );
}
