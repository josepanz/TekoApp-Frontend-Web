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
import { useServiceDetailQuery } from '../hooks';
import type { Service, ServiceStatus } from '../api';

const STATUS_VARIANT: Record<
  ServiceStatus,
  'default' | 'secondary' | 'destructive' | 'outline'
> = {
  PENDING: 'secondary',
  ACCEPTED: 'outline',
  IN_PROGRESS: 'default',
  COMPLETED: 'secondary',
  CANCELLED: 'destructive',
};

// El DTO generado no expone un único campo "monto": según el ciclo de vida del servicio puede
// venir como estimatedHours/actualHours (por hora), hourlyRate, fixedPrice (tarifa cerrada),
// totalAmount (estimado) o finalAmount (ya facturado). Se muestran todos los que estén presentes
// en vez de elegir uno solo, a diferencia de la tabla (que sí necesita un único valor por fila).

export function ServiceDetailView({ id }: { id: string }) {
  const t = useTranslations('services');
  const locale = useAppLocale();
  const { data: service, isPending, isError } = useServiceDetailQuery(id);

  if (isPending) {
    return <Skeleton className="h-96 max-w-2xl" />;
  }

  if (isError || !service) {
    return <p className="text-muted-foreground">{t('detail.loadError')}</p>;
  }

  const statusLabel: Record<ServiceStatus, string> = {
    PENDING: t('status.PENDING'),
    ACCEPTED: t('status.ACCEPTED'),
    IN_PROGRESS: t('status.IN_PROGRESS'),
    COMPLETED: t('status.COMPLETED'),
    CANCELLED: t('status.CANCELLED'),
  };

  return (
    <div className="flex max-w-2xl flex-col gap-4">
      <Button
        variant="ghost"
        size="sm"
        className="w-fit"
        nativeButton={false}
        render={
          <Link href="/admin/services">
            <ArrowLeft />
            {t('detail.back')}
          </Link>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle>{service.title}</CardTitle>
          {service.category && (
            <p className="text-muted-foreground text-sm">
              {service.category.name}
            </p>
          )}
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={STATUS_VARIANT[service.status]}>
              {statusLabel[service.status]}
            </Badge>
            {service.isUrgent && (
              <Badge variant="destructive">{t('detail.urgent')}</Badge>
            )}
          </div>

          <p className="text-muted-foreground">{service.description}</p>

          <div className="grid gap-4 sm:grid-cols-2">
            <ClientInfo service={service} label={t('detail.client')} />
            <ProfessionalInfo
              service={service}
              label={t('detail.professional')}
              unassignedLabel={t('detail.unassigned')}
            />
          </div>

          <div className="flex flex-wrap gap-4 text-sm">
            {service.estimatedHours !== undefined && (
              <span>
                {t('detail.estimatedHours', {
                  hours: service.estimatedHours,
                })}
              </span>
            )}
            {service.actualHours !== undefined && (
              <span>
                {t('detail.actualHours', { hours: service.actualHours })}
              </span>
            )}
            {service.hourlyRate !== undefined && (
              <span>
                {t('detail.hourlyRate', {
                  rate: formatCurrency(service.hourlyRate),
                })}
              </span>
            )}
            {service.fixedPrice !== undefined && (
              <span>
                {t('detail.fixedPrice', {
                  price: formatCurrency(service.fixedPrice),
                })}
              </span>
            )}
            {service.totalAmount !== undefined && (
              <span>
                {t('detail.totalAmount', {
                  amount: formatCurrency(service.totalAmount),
                })}
              </span>
            )}
            {service.finalAmount !== undefined && (
              <span>
                {t('detail.finalAmount', {
                  amount: formatCurrency(service.finalAmount),
                })}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium">{t('detail.address')}</span>
            <span className="text-muted-foreground text-sm">
              {service.address}
            </span>
          </div>

          {service.additionalNotes && (
            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium">
                {t('detail.additionalNotes')}
              </span>
              <p className="text-muted-foreground text-sm">
                {service.additionalNotes}
              </p>
            </div>
          )}

          {service.images.length > 0 && (
            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium">{t('detail.images')}</span>
              <ul className="flex flex-col gap-1">
                {service.images.map((url) => (
                  <li key={url}>
                    <a
                      className="text-primary text-sm underline"
                      href={url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {url}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {service.status === 'CANCELLED' && service.cancellationReason && (
            <p className="text-destructive text-sm">
              {t('detail.cancellationReason', {
                reason: service.cancellationReason,
              })}
            </p>
          )}

          <div className="text-muted-foreground flex flex-wrap gap-4 text-xs">
            {service.scheduledAt && (
              <span>
                {t('detail.scheduledAt', {
                  date: formatDate(service.scheduledAt, locale),
                })}
              </span>
            )}
            {service.startedAt && (
              <span>
                {t('detail.startedAt', {
                  date: formatDate(service.startedAt, locale),
                })}
              </span>
            )}
            {service.completedAt && (
              <span>
                {t('detail.completedAt', {
                  date: formatDate(service.completedAt, locale),
                })}
              </span>
            )}
            {service.cancelledAt && (
              <span>
                {t('detail.cancelledAt', {
                  date: formatDate(service.cancelledAt, locale),
                })}
              </span>
            )}
            <span>
              {t('detail.createdAt', {
                date: formatDate(service.createdAt, locale),
              })}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ClientInfo({ service, label }: { service: Service; label: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-sm font-medium">{label}</span>
      <span>
        {service.users.firstName} {service.users.lastName}
      </span>
      <span className="text-muted-foreground text-sm">
        {service.users.email}
        {service.users.phoneNumber ? ` · ${service.users.phoneNumber}` : ''}
      </span>
    </div>
  );
}

function ProfessionalInfo({
  service,
  label,
  unassignedLabel,
}: {
  service: Service;
  label: string;
  unassignedLabel: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-sm font-medium">{label}</span>
      {service.professional?.user ? (
        <>
          <span>
            {service.professional.user.firstName}{' '}
            {service.professional.user.lastName}
          </span>
          <span className="text-muted-foreground text-sm">
            {service.professional.user.email}
            {service.professional.user.phoneNumber
              ? ` · ${service.professional.user.phoneNumber}`
              : ''}
          </span>
        </>
      ) : (
        <span className="text-muted-foreground text-sm">{unassignedLabel}</span>
      )}
    </div>
  );
}
