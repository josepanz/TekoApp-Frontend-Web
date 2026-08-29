'use client';

import { PlusIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MaterialCatalogItemFormDialog } from './material-catalog-item-form-dialog';

export function NewMaterialCatalogItemButton() {
  const t = useTranslations('materialCatalog');
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <PlusIcon />
        {t('newButton')}
      </Button>
      <MaterialCatalogItemFormDialog open={open} onOpenChange={setOpen} />
    </>
  );
}
