'use client';

import { PlusIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ProfessionalDocumentTypeFormDialog } from './professional-document-type-form-dialog';

export function NewProfessionalDocumentTypeButton() {
  const t = useTranslations('professionalDocumentTypes');
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <PlusIcon />
        {t('newButton')}
      </Button>
      <ProfessionalDocumentTypeFormDialog open={open} onOpenChange={setOpen} />
    </>
  );
}
