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
import { usePromotionDetailQuery } from '../hooks';
import type { Promotion } from '../api';
import { PromotionFormDialog } from './promotion-form-dialog';

const STATUS_VARIANT: Record<
  Promotion['status'],
  'default' | 'secondary' | 'destructive'
> = {
  ACTIVE: 'default',
  INACTIVE: 'secondary',
  EXPIRED: 'destructive',
  DEPLETED: 'destructive',
};

function formatDiscount(
  promotion: Promotion,
  t: ReturnType<typeof useTranslations>,
): string {
  if (promotion.type === 'PERCENTAGE') {
    return `${promotion.discountPercentage ?? 0}%`;
  }
  if (promotion.type === 'FIXED_AMOUNT') {
    return formatCurrency(promotion.discountAmount ?? 0);
  }
  return t('type.FREE_SERVICE');
}

export function PromotionDetailView({ id }: { id: string }) {
  const t = useTranslations('promotions');
  const locale = useAppLocale();
  const { data: promotion, isPending, isError } = usePromotionDetailQuery(id);

  if (isPending) {
    return <Skeleton className="h-96 max-w-2xl" />;
  }

  if (isError || !promotion) {
    return <p className="text-muted-foreground">{t('detail.loadError')}</p>;
  }

  const isUnlimited = promotion.maxUsage === -1;

  return (
    <div className="flex max-w-2xl flex-col gap-4">
      <Button
        variant="ghost"
        size="sm"
        className="w-fit"
        nativeButton={false}
        render={
          <Link href="/admin/promotions">
            <ArrowLeft />
            {t('detail.back')}
          </Link>
        }
      />

      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-4">
          <div className="flex flex-col gap-1">
            <Badge variant="outline" className="w-fit font-mono">
              {promotion.code}
            </Badge>
            <CardTitle>{promotion.name}</CardTitle>
          </div>
          <PromotionFormDialog
            promotion={promotion}
            trigger={
              <Button variant="outline" size="sm">
                {t('detail.editButton')}
              </Button>
            }
          />
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={STATUS_VARIANT[promotion.status]}>
              {t(`status.${promotion.status}`)}
            </Badge>
            <Badge variant="secondary">{t(`type.${promotion.type}`)}</Badge>
          </div>

          {promotion.description && (
            <p className="text-muted-foreground">{promotion.description}</p>
          )}

          <div className="flex flex-wrap gap-4 text-sm">
            <span>
              {t('detail.discount', {
                value: formatDiscount(promotion, t),
              })}
            </span>
            {promotion.minimumAmount != null && (
              <span>
                {t('detail.minimumAmount', {
                  amount: formatCurrency(promotion.minimumAmount),
                })}
              </span>
            )}
            {promotion.maximumDiscount != null && (
              <span>
                {t('detail.maximumDiscount', {
                  amount: formatCurrency(promotion.maximumDiscount),
                })}
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-4 text-sm">
            <span>
              {isUnlimited
                ? t('detail.usageUnlimited', {
                    current: promotion.currentUsage,
                  })
                : t('detail.usage', {
                    current: promotion.currentUsage,
                    max: promotion.maxUsage,
                  })}
            </span>
            <span>
              {t('detail.maxUsagePerUser', {
                count: promotion.maxUsagePerUser,
              })}
            </span>
          </div>

          <p className="text-sm">
            {t('detail.validity', {
              from: formatDate(promotion.validFrom, locale),
              until: formatDate(promotion.validUntil, locale),
            })}
          </p>

          {promotion.allowedUserTypes.length > 0 && (
            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium">
                {t('detail.allowedUserTypes')}
              </span>
              <div className="flex flex-wrap gap-2">
                {promotion.allowedUserTypes.map((userType) => (
                  <Badge key={userType} variant="outline">
                    {userType}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {promotion.specificUserIds.length > 0 && (
            <p className="text-muted-foreground text-sm">
              {t('detail.specificUsers', {
                count: promotion.specificUserIds.length,
              })}
            </p>
          )}

          <p className="text-muted-foreground text-xs">
            {t('detail.createdAt', {
              date: formatDate(promotion.createdAt, locale),
            })}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
