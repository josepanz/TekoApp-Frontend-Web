'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { ArrowLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDate } from '@/lib/formatters';
import { useAppLocale } from '@/i18n/use-app-locale';
import { useCategoryDetailQuery, useCategoryStatsQuery } from '../hooks';
import type { Category } from '../api';
import { CategoryIcon } from './category-label';

const STATUS_VARIANT: Record<
  Category['status'],
  'default' | 'secondary' | 'destructive'
> = {
  ACTIVE: 'default',
  INACTIVE: 'secondary',
  PENDING: 'secondary',
};

export function CategoryDetailView({ id }: { id: string }) {
  const t = useTranslations('categories');
  const locale = useAppLocale();
  const categoryId = Number(id);
  const {
    data: category,
    isPending,
    isError,
  } = useCategoryDetailQuery(categoryId);
  const {
    data: stats,
    isPending: statsPending,
    isError: statsError,
  } = useCategoryStatsQuery(categoryId);

  if (isPending) {
    return <Skeleton className="h-96 max-w-2xl" />;
  }

  if (isError || !category) {
    return <p className="text-muted-foreground">{t('detail.loadError')}</p>;
  }

  const statusLabel: Record<Category['status'], string> = {
    ACTIVE: t('status.ACTIVE'),
    INACTIVE: t('status.INACTIVE'),
    PENDING: t('status.PENDING'),
  };

  return (
    <div className="flex max-w-2xl flex-col gap-4">
      <Button
        variant="ghost"
        size="sm"
        className="w-fit"
        nativeButton={false}
        render={
          <Link href="/admin/categories">
            <ArrowLeft />
            {t('detail.back')}
          </Link>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle>{category.name}</CardTitle>
          <p className="text-muted-foreground text-sm">
            {t('detail.slugLabel', { slug: category.slug })}
          </p>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={STATUS_VARIANT[category.status]}>
              {statusLabel[category.status]}
            </Badge>
            <Badge variant="outline" className="gap-1.5">
              <CategoryIcon icon={category.icon} color={category.color} />
              {category.icon ?? '—'}
            </Badge>
            <Badge variant={category.isVisible ? 'default' : 'secondary'}>
              {category.isVisible ? t('detail.yes') : t('detail.no')} —{' '}
              {t('detail.visibleLabel')}
            </Badge>
            <Badge
              variant={category.requiresVerification ? 'default' : 'secondary'}
            >
              {category.requiresVerification ? t('detail.yes') : t('detail.no')}{' '}
              — {t('detail.requiresVerificationLabel')}
            </Badge>
          </div>

          {category.description && (
            <p className="text-muted-foreground">{category.description}</p>
          )}

          <div className="flex flex-wrap gap-4 text-sm">
            <span>
              {t('detail.sortOrderLabel', { order: category.sortOrder })}
            </span>
            {category.parentCategoryId != null && (
              <span>
                {t('detail.parentCategoryLabel', {
                  id: category.parentCategoryId,
                })}
              </span>
            )}
          </div>

          {statsPending && <Skeleton className="h-6 w-full" />}
          {statsError && (
            <p className="text-muted-foreground text-xs">
              {t('detail.statsLoadError')}
            </p>
          )}
          {!statsPending && !statsError && stats && (
            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium">
                {t('detail.statsTitle')}
              </span>
              <div className="flex flex-wrap gap-4 text-sm">
                <span>
                  {t('detail.professionalCount', {
                    count: stats.professionalCount,
                  })}
                </span>
                <span>
                  {t('detail.serviceCount', { count: stats.serviceCount })}
                </span>
                <span>
                  {t('detail.averageRating', {
                    rating: Number(stats.averageRating).toFixed(1),
                  })}
                </span>
              </div>
            </div>
          )}

          <p className="text-muted-foreground text-xs">
            {t('detail.createdAt', {
              date: formatDate(category.createdAt, locale),
            })}
            {category.lastChangedAt
              ? ` · ${t('detail.lastChangedAt', {
                  date: formatDate(category.lastChangedAt, locale),
                })}`
              : ''}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
