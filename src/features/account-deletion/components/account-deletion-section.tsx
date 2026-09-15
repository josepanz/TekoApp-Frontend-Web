'use client';

import { AlertTriangle } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { toast } from 'sonner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import type { SessionUser } from '@/core/auth/session';
import { useAppLocale } from '@/i18n/use-app-locale';
import { formatDate } from '@/lib/formatters';
import { extractDeletionBlockers, type DeletionBlocker } from '../api';
import {
  useCancelAccountDeletionMutation,
  useRequestAccountDeletionMutation,
} from '../hooks';

interface AccountDeletionSectionProps {
  session: SessionUser;
}

type DialogStep = 'info' | 'confirm';

type AccountDeletionTranslator = ReturnType<
  typeof useTranslations<'accountDeletion'>
>;

// `t()` de next-intl exige una clave literal tipada (no un `string` genérico armado con un
// `Record<..., string>`) — de ahí el switch en vez de indexar un mapa de claves.
function blockerLabel(
  t: AccountDeletionTranslator,
  blocker: DeletionBlocker,
): string {
  switch (blocker.type) {
    case 'ACTIVE_SERVICE':
      return t('blockers.ACTIVE_SERVICE', { count: blocker.count });
    case 'PENDING_PAYMENT':
      return t('blockers.PENDING_PAYMENT', { count: blocker.count });
    case 'UNSIGNED_CONTRACT':
      return t('blockers.UNSIGNED_CONTRACT', { count: blocker.count });
    case 'OPEN_DISPUTE':
      return t('blockers.OPEN_DISPUTE', { count: blocker.count });
  }
}

// Confirmación de dos pasos (I-02): paso 1 informativo (qué se anonimiza/conserva, ventana de
// gracia, irreversibilidad), paso 2 con checkbox obligatorio antes de habilitar el envío — mismo
// criterio que `TekoApp-Frontend-Mobile/openspec/specs/account-deletion.md` (el copy legal real
// lo define José con asesoría, ver esa spec y la del backend; acá solo se listan los hechos
// técnicos ya definidos en el contrato, sin inventar lenguaje legal).
export function AccountDeletionSection({
  session,
}: AccountDeletionSectionProps) {
  const t = useTranslations('accountDeletion');
  const locale = useAppLocale();
  const [scheduledAt, setScheduledAt] = useState(session.deletionScheduledAt);
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<DialogStep>('info');
  const [confirmed, setConfirmed] = useState(false);
  const [blockers, setBlockers] = useState<DeletionBlocker[] | null>(null);

  const requestMutation = useRequestAccountDeletionMutation();
  const cancelMutation = useCancelAccountDeletionMutation();

  function resetDialog() {
    setStep('info');
    setConfirmed(false);
    setBlockers(null);
  }

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);
    if (!nextOpen) {
      resetDialog();
    }
  }

  function handleConfirm() {
    setBlockers(null);
    requestMutation.mutate(undefined, {
      onSuccess: (data) => {
        setScheduledAt(data.deletionScheduledAt);
        handleOpenChange(false);
        toast.success(t('confirm.success'));
      },
      onError: (error) => {
        const found = extractDeletionBlockers(error);
        if (found && found.length > 0) {
          setBlockers(found);
        } else {
          toast.error(t('confirm.genericError'));
        }
      },
    });
  }

  function handleCancelDeletion() {
    cancelMutation.mutate(undefined, {
      onSuccess: () => {
        setScheduledAt(null);
        toast.success(t('banner.cancelSuccess'));
      },
      onError: () => {
        toast.error(t('banner.cancelError'));
      },
    });
  }

  // Ventana de gracia activa: banner persistente (no descartable salvo cancelando la solicitud,
  // mismo criterio que la spec de Mobile) en vez del botón de borrado.
  if (scheduledAt) {
    return (
      <Alert variant="warning">
        <AlertTriangle />
        <AlertTitle>{t('banner.title')}</AlertTitle>
        <AlertDescription>
          {t('banner.description', { date: formatDate(scheduledAt, locale) })}
        </AlertDescription>
        <div className="mt-2">
          <Button
            variant="outline"
            size="sm"
            disabled={cancelMutation.isPending}
            onClick={handleCancelDeletion}
          >
            {cancelMutation.isPending
              ? t('banner.cancelling')
              : t('banner.cancel')}
          </Button>
        </div>
      </Alert>
    );
  }

  return (
    <div className="border-destructive/30 flex flex-col gap-2 rounded-lg border p-4">
      <p className="text-sm font-medium">{t('section.title')}</p>
      <p className="text-muted-foreground text-sm">
        {t('section.description')}
      </p>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogTrigger
          render={
            <Button variant="destructive" size="sm" className="self-start">
              {t('section.trigger')}
            </Button>
          }
        />
        <DialogContent>
          {step === 'info' ? (
            <>
              <DialogHeader>
                <DialogTitle>{t('info.title')}</DialogTitle>
                <DialogDescription>{t('info.description')}</DialogDescription>
              </DialogHeader>
              <ul className="list-disc space-y-1 pl-5 text-sm">
                <li>{t('info.anonymized')}</li>
                <li>{t('info.retained')}</li>
                <li>{t('info.gracePeriod')}</li>
                <li>{t('info.irreversible')}</li>
              </ul>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => handleOpenChange(false)}
                >
                  {t('info.cancel')}
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => setStep('confirm')}
                >
                  {t('info.continue')}
                </Button>
              </DialogFooter>
            </>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle>{t('confirm.title')}</DialogTitle>
                <DialogDescription>
                  {t('confirm.description')}
                </DialogDescription>
              </DialogHeader>

              {blockers && blockers.length > 0 && (
                <div className="bg-muted flex flex-col gap-1 rounded-md p-3 text-sm">
                  <p className="font-medium">{t('confirm.blockedTitle')}</p>
                  <ul className="list-disc pl-5">
                    {blockers.map((blocker) => (
                      <li key={blocker.type}>{blockerLabel(t, blocker)}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex items-center gap-2">
                <Checkbox
                  id="account-deletion-confirm-checkbox"
                  checked={confirmed}
                  onCheckedChange={(checked) => setConfirmed(checked === true)}
                />
                <Label htmlFor="account-deletion-confirm-checkbox">
                  {t('confirm.checkboxLabel')}
                </Label>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setStep('info')}>
                  {t('confirm.back')}
                </Button>
                <Button
                  variant="destructive"
                  disabled={!confirmed || requestMutation.isPending}
                  onClick={handleConfirm}
                >
                  {requestMutation.isPending
                    ? t('confirm.pending')
                    : t('confirm.submit')}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
