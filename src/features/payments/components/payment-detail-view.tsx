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
import { RefundPaymentDialog } from './refund-payment-dialog';

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

// Un pago solo se puede reembolsar si ya fue efectivamente cobrado, y solo se puede cancelar si
// todavía no se procesó — mismo criterio que `payments-table.tsx`.
const REFUNDABLE_STATUSES: PaymentStatus[] = ['PAID', 'COMPLETED'];
const CANCELLABLE_STATUSES: PaymentStatus[] = ['PENDING', 'PROCESSING'];

export function PaymentDetailView({ id }: { id: string }) {
  const t = useTranslations('payments');
  const locale = useAppLocale();
  const { data: payment, isPending, isError } = usePaymentDetailQuery(id);

  if (isPending) {
    return <Skeleton className="h-96 max-w-2xl" />;
  }

  if (isError || !payment) {
    return <p className="text-muted-foreground">{t('detail.loadError')}</p>;
  }

  return (
    <div className="flex max-w-2xl flex-col gap-4">
      <Button
        variant="ghost"
        size="sm"
        className="w-fit"
        nativeButton={false}
        render={
          <Link href="/admin/payments">
            <ArrowLeft />
            {t('detail.back')}
          </Link>
        }
      />

      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-4">
          <div>
            <CardTitle>
              {t('detail.title', { reference: payment.transactionId })}
            </CardTitle>
            <p className="text-muted-foreground text-sm">
              {t('detail.userLabel')} #{payment.userId} ·{' '}
              {t('detail.professionalLabel')} #{payment.professionalId}
            </p>
          </div>
          <div className="flex gap-2">
            {REFUNDABLE_STATUSES.includes(payment.status) && (
              <RefundPaymentDialog
                paymentId={payment.id}
                amount={payment.totalAmount}
              />
            )}
            {CANCELLABLE_STATUSES.includes(payment.status) && (
              <CancelPaymentDialog paymentId={payment.id} />
            )}
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={STATUS_VARIANT[payment.status]}>
              {t(`status.${payment.status}`)}
            </Badge>
            <Badge variant="secondary">{payment.paymentMethod}</Badge>
            <Badge variant="secondary">{payment.paymentProvider}</Badge>
            {payment.isRecurring && <Badge>{t('detail.recurring')}</Badge>}
          </div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <span>
              {t('detail.amountLabel')}:{' '}
              {formatCurrency(payment.amount, payment.currencyCode)}
            </span>
            <span>
              {t('detail.feeLabel')}:{' '}
              {formatCurrency(payment.fee, payment.currencyCode)}
            </span>
            <span>
              {t('detail.taxLabel')}:{' '}
              {formatCurrency(payment.tax, payment.currencyCode)}
            </span>
            <span>
              {t('detail.totalLabel')}:{' '}
              {formatCurrency(payment.totalAmount, payment.currencyCode)}
            </span>
            <span>
              {t('detail.platformFeeLabel')}:{' '}
              {formatCurrency(payment.platformFee, payment.currencyCode)}
            </span>
            {payment.professionalNetAmount !== undefined && (
              <span>
                {t('detail.professionalNetAmountLabel')}:{' '}
                {formatCurrency(
                  payment.professionalNetAmount,
                  payment.currencyCode,
                )}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-1 text-sm">
            <span>
              {t('detail.transactionIdLabel')}: {payment.transactionId}
            </span>
            {payment.externalTransactionId && (
              <span>
                {t('detail.externalTransactionIdLabel')}:{' '}
                {payment.externalTransactionId}
              </span>
            )}
            <span>
              {t('detail.serviceLabel')}: #{payment.serviceId}
            </span>
          </div>

          {payment.description && (
            <p className="text-muted-foreground">{payment.description}</p>
          )}

          <div className="text-muted-foreground flex flex-col gap-1 text-xs">
            <span>
              {t('detail.createdAtLabel')}:{' '}
              {formatDate(payment.createdAt, locale)}
            </span>
            {payment.processedAt && (
              <span>
                {t('detail.processedAtLabel')}:{' '}
                {formatDate(payment.processedAt, locale)}
              </span>
            )}
            {payment.paidAt && (
              <span>
                {t('detail.paidAtLabel')}: {formatDate(payment.paidAt, locale)}
              </span>
            )}
            {payment.failedAt && (
              <span>
                {t('detail.failedAtLabel')}:{' '}
                {formatDate(payment.failedAt, locale)}
              </span>
            )}
          </div>

          {payment.failureReason && (
            <p className="text-destructive text-sm">
              {t('detail.failureReasonLabel')}: {payment.failureReason}
            </p>
          )}

          {payment.refundDetails && (
            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium">
                {t('detail.refundDetailsLabel')}
              </span>
              <pre className="bg-muted overflow-x-auto rounded-md p-2 text-xs">
                {JSON.stringify(payment.refundDetails, null, 2)}
              </pre>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
