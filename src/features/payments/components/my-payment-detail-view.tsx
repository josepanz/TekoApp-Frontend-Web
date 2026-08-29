'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { ArrowLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrency, formatDate } from '@/lib/formatters';
import { useAppLocale } from '@/i18n/use-app-locale';
import { usePaymentDetailQuery } from '../hooks';
import type { PaymentStatus } from '../api';
import { CancelPaymentDialog } from './cancel-payment-dialog';
import { TipDialog } from './tip-dialog';

const STATUS_VARIANT: Record<
  PaymentStatus,
  'default' | 'secondary' | 'destructive'
> = {
  PENDING: 'secondary',
  PROCESSING: 'secondary',
  PAID: 'default',
  COMPLETED: 'default',
  REFUNDED: 'secondary',
  PARTIAL_REFUNDED: 'secondary',
  FAILED: 'destructive',
  CANCELLED: 'destructive',
};

const CANCELLABLE_STATUSES: PaymentStatus[] = ['PENDING', 'PROCESSING'];
// Mismo criterio que `TipsService.createTip` del backend: solo pagos ya cobrados y sin propina
// previa aceptan una propina nueva.
const TIPPABLE_STATUSES: PaymentStatus[] = ['PAID', 'COMPLETED'];

// Vista de detalle del pago propio del cliente/profesional — a diferencia de
// `PaymentDetailView` (admin, `/admin/payments/[id]`), acá no se muestran IDs internos
// (`userId`/`professionalId`) ni la acción de reembolso (exclusiva de staff), y sí se ofrece
// dejar propina cuando corresponde.
export function MyPaymentDetailView({ id }: { id: string }) {
  const t = useTranslations('myPayments');
  const locale = useAppLocale();
  const { data: payment, isPending, isError } = usePaymentDetailQuery(id);

  if (isPending) {
    return <Skeleton className="h-96 max-w-2xl" />;
  }

  if (isError || !payment) {
    return <p className="text-muted-foreground">{t('detail.loadError')}</p>;
  }

  const isTippable = !payment.tip && TIPPABLE_STATUSES.includes(payment.status);

  return (
    <div className="flex max-w-2xl flex-col gap-4">
      <Button
        variant="ghost"
        size="sm"
        className="w-fit"
        nativeButton={false}
        render={
          <Link href="/mis-pagos">
            <ArrowLeft />
            {t('detail.back')}
          </Link>
        }
      />

      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-4">
          <CardTitle>
            {t('detail.title', { reference: payment.transactionId })}
          </CardTitle>
          <div className="flex gap-2">
            {isTippable && <TipDialog paymentId={payment.referenceId} />}
            {CANCELLABLE_STATUSES.includes(payment.status) && (
              <CancelPaymentDialog paymentId={payment.referenceId} />
            )}
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={STATUS_VARIANT[payment.status]}>
              {t(`status.${payment.status}`)}
            </Badge>
            <Badge variant="secondary">{payment.paymentMethod}</Badge>
          </div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <span>
              {t('detail.amountLabel')}:{' '}
              {formatCurrency(payment.amount, payment.currencyCode)}
            </span>
            <span>
              {t('detail.totalLabel')}:{' '}
              {formatCurrency(payment.totalAmount, payment.currencyCode)}
            </span>
            {payment.tip && (
              <span>
                {t('detail.tipLabel')}:{' '}
                {formatCurrency(payment.tip.amount, payment.tip.currencyCode)}
              </span>
            )}
          </div>

          <div className="text-muted-foreground flex flex-col gap-1 text-xs">
            <span>
              {t('detail.createdAtLabel')}:{' '}
              {formatDate(payment.createdAt, locale)}
            </span>
            {payment.paidAt && (
              <span>
                {t('detail.paidAtLabel')}: {formatDate(payment.paidAt, locale)}
              </span>
            )}
          </div>

          {payment.failureReason && (
            <p className="text-destructive text-sm">
              {t('detail.failureReasonLabel')}: {payment.failureReason}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
