'use client';

import { PlusIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { LegalDocumentVersionFormDialog } from './legal-document-version-form-dialog';

export function NewLegalDocumentVersionButton() {
  const t = useTranslations('legalDocumentVersions');
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <PlusIcon />
        {t('newButton')}
      </Button>
      <LegalDocumentVersionFormDialog open={open} onOpenChange={setOpen} />
    </>
  );
}
