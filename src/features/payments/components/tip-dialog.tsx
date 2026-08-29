'use client';

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { HandCoins } from 'lucide-react';
import { useCreateTipMutation, useTipConfigQuery } from '../hooks';
import { createTipSchema, type CreateTipFormValues } from '../schemas';

interface TipDialogProps {
  paymentId: string;
}

// Solo ofrece PERCENTAGE (chips de porcentaje sugerido) y FREE (monto libre) — `TipMode.FIXED`
// existe en el dominio/backend pero no tiene una config de montos preestablecidos todavía, mismo
// alcance que el dialog equivalente de Mobile (ver openspec/decisions.md).
export function TipDialog({ paymentId }: TipDialogProps) {
  const t = useTranslations('myPayments.tip');
  const tCommon = useTranslations('common');
  const [open, setOpen] = useState(false);
  const { data: config, isPending: isConfigPending } = useTipConfigQuery();
  const mutation = useCreateTipMutation();

  const {
    register,
    handleSubmit,
    reset: resetForm,
    setValue,
    formState: { errors },
  } = useForm<CreateTipFormValues>({
    resolver: standardSchemaResolver(createTipSchema),
    defaultValues: {
      mode: 'PERCENTAGE',
      percentage: undefined,
      amount: undefined,
    },
  });

  // Estado puramente visual (qué botón/campo está activo) — separado de react-hook-form porque
  // `watch()` desactiva la memoización de React Compiler en este árbol (warning de
  // `react-hooks/incompatible-library`, este proyecto exige 0 warnings de lint).
  const [selection, setSelection] = useState<{
    mode: 'PERCENTAGE' | 'FREE';
    percentage?: number;
  }>({ mode: 'PERCENTAGE', percentage: undefined });

  function reset() {
    resetForm();
    setSelection({ mode: 'PERCENTAGE', percentage: undefined });
  }

  function selectPercentage(percentage: number) {
    setSelection({ mode: 'PERCENTAGE', percentage });
    setValue('mode', 'PERCENTAGE');
    setValue('percentage', percentage, { shouldValidate: true });
    setValue('amount', undefined);
  }

  function onSubmit(values: CreateTipFormValues) {
    mutation.mutate(
      {
        paymentId,
        dto:
          values.mode === 'PERCENTAGE'
            ? { mode: 'PERCENTAGE', percentage: values.percentage }
            : { mode: 'FREE', amount: values.amount },
      },
      {
        onSuccess: () => {
          setOpen(false);
          reset();
        },
      },
    );
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen: boolean) => {
        setOpen(nextOpen);
        if (!nextOpen) reset();
      }}
    >
      <DialogTrigger
        render={
          <Button variant="outline" size="sm">
            <HandCoins />
            {t('trigger')}
          </Button>
        }
      />
      <DialogContent>
        {isConfigPending || !config ? (
          <Skeleton className="h-40" />
        ) : (
          <form
            onSubmit={(event) => void handleSubmit(onSubmit)(event)}
            className="flex flex-col gap-4"
            noValidate
          >
            <DialogHeader>
              <DialogTitle>{t('title')}</DialogTitle>
              <DialogDescription>{t('description')}</DialogDescription>
            </DialogHeader>

            <div className="flex flex-wrap gap-2">
              {config.suggestedPercentages.map((percentage) => (
                <Button
                  key={percentage}
                  type="button"
                  variant={
                    selection.mode === 'PERCENTAGE' &&
                    selection.percentage === percentage
                      ? 'default'
                      : 'outline'
                  }
                  size="sm"
                  onClick={() => selectPercentage(percentage)}
                >
                  {percentage}%
                </Button>
              ))}
            </div>

            {config.allowFreeAmount && (
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="tip-custom-amount">
                  {t('customAmountLabel')}
                </Label>
                <Input
                  id="tip-custom-amount"
                  type="number"
                  step="0.01"
                  aria-invalid={!!errors.amount}
                  {...register('amount', {
                    valueAsNumber: true,
                    onChange: () => {
                      setSelection({ mode: 'FREE', percentage: undefined });
                      setValue('mode', 'FREE');
                      setValue('percentage', undefined);
                    },
                  })}
                />
              </div>
            )}
            {errors.amount && (
              <p className="text-destructive text-sm">
                {errors.amount.message}
              </p>
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                {tCommon('actions.cancel')}
              </Button>
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? t('submitting') : t('submit')}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
