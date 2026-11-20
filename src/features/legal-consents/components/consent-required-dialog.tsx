'use client';

import { ExternalLinkIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import type { ConsentDocumentType } from '../api';
import {
  consentErrorMessage,
  useAcceptConsentsMutation,
  usePendingConsentsQuery,
} from '../hooks';

interface ConsentRequiredDialogProps {
  documentType: ConsentDocumentType;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Se llama cuando el usuario aceptó; el caller reintenta la operación que dio 403. */
  onAccepted: () => void;
}

// El backend bloquea la subida de documentos (DATA_PROCESSING_CONSENT) y de fotos
// (IMAGE_USAGE_CONSENT) con `403 CONSENT_REQUIRED` hasta que el usuario acepte el documento legal
// vigente. Antes la Web solo mostraba el mensaje y no había forma de aceptar (DEF-WEB-004).
export function ConsentRequiredDialog({
  documentType,
  open,
  onOpenChange,
  onAccepted,
}: ConsentRequiredDialogProps) {
  const t = useTranslations('legalConsents.required');
  const tCommon = useTranslations('common');
  const { data: pending, isPending, isError } = usePendingConsentsQuery(open);
  const acceptMutation = useAcceptConsentsMutation(documentType);
  const versions = pending?.filter((v) => v.documentType === documentType);

  function accept() {
    acceptMutation.mutate(undefined, { onSuccess: onAccepted });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent data-testid="consent-required-dialog">
        <DialogHeader>
          <DialogTitle>{t(`title.${documentType}`)}</DialogTitle>
          <DialogDescription>
            {t(`description.${documentType}`)}
          </DialogDescription>
        </DialogHeader>

        {isPending && <Skeleton className="h-10" />}
        {isError && (
          <p className="text-destructive text-sm" role="alert">
            {t('loadError')}
          </p>
        )}
        {versions?.map((version) => (
          <a
            key={version.referenceId}
            href={version.contentUrl}
            target="_blank"
            rel="noreferrer"
            className="text-primary flex w-fit items-center gap-2 text-sm underline"
          >
            <ExternalLinkIcon className="size-4" aria-hidden="true" />
            {t('viewDocument', { version: version.version })}
          </a>
        ))}
        {versions && versions.length === 0 && (
          <p className="text-muted-foreground text-sm">{t('nothingPending')}</p>
        )}
        {acceptMutation.isError && (
          <p className="text-destructive text-sm" role="alert">
            {consentErrorMessage(acceptMutation.error, t('acceptError'))}
          </p>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {tCommon('actions.cancel')}
          </Button>
          <Button
            onClick={accept}
            disabled={acceptMutation.isPending || isPending || isError}
          >
            {acceptMutation.isPending ? t('accepting') : t('accept')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
