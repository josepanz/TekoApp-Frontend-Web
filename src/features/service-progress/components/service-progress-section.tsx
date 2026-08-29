'use client';

import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDate } from '@/lib/formatters';
import { useAppLocale } from '@/i18n/use-app-locale';
import { useSessionScopeQuery } from '@/core/auth/hooks';
import { hasAnyPermission, PERMISSIONS } from '@/core/auth/permissions';
import { usePresignedUrlQuery, useServiceProgressQuery } from '../hooks';
import type { ServiceProgressEntry } from '../api';

// Bitácora de avance de un servicio, visible para staff en el detalle admin — decisión de alcance
// confirmada con José (2026-08-27, ver TekoApp-Backend/openspec/specs/work-progress-log.md): el
// staff reusa el mismo GET que ya consumen cliente/profesional en mobile, sin endpoint dedicado.
//
// Gate client-side por permiso (`service-progress.audit:read`/`admin:all`) ANTES de pedir el
// listado — el permiso todavía no está asignado a ningún rol (ver decisions.md del backend), así
// que sin este gate cualquier staff vería una sección que siempre falla con 403.
export function ServiceProgressSection({ serviceId }: { serviceId: string }) {
  const { data: scope } = useSessionScopeQuery();
  const canView = hasAnyPermission(
    (scope?.permissions ?? []).map((permission) => permission.name),
    [PERMISSIONS.SERVICE_PROGRESS.AUDIT_VIEW, PERMISSIONS.ADMIN.ALL],
  );

  if (!canView) {
    return null;
  }

  return <ServiceProgressCard serviceId={serviceId} />;
}

function ServiceProgressCard({ serviceId }: { serviceId: string }) {
  const t = useTranslations('services');
  const { data, isPending, isError } = useServiceProgressQuery(serviceId);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('detail.progressLog.title')}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {isPending && <Skeleton className="h-24" />}
        {isError && (
          <p className="text-muted-foreground text-sm">
            {t('detail.progressLog.loadError')}
          </p>
        )}
        {!isPending && !isError && data.data.length === 0 && (
          <p className="text-muted-foreground text-sm">
            {t('detail.progressLog.empty')}
          </p>
        )}
        {!isPending &&
          !isError &&
          data.data.map((entry) => (
            <ProgressEntryRow key={entry.referenceId} entry={entry} />
          ))}
      </CardContent>
    </Card>
  );
}

function ProgressEntryRow({ entry }: { entry: ServiceProgressEntry }) {
  const locale = useAppLocale();

  return (
    <div className="border-border flex flex-col gap-2 border-b pb-4 last:border-b-0 last:pb-0">
      <span className="text-muted-foreground text-xs">
        {formatDate(entry.createdAt, locale)}
      </span>
      {entry.note && <p className="text-sm">{entry.note}</p>}
      {entry.images.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {entry.images.map((key) => (
            <ProgressEntryPhoto key={key} imageKey={key} />
          ))}
        </div>
      )}
    </div>
  );
}

function ProgressEntryPhoto({ imageKey }: { imageKey: string }) {
  const t = useTranslations('services');
  const { data, isPending, isError } = usePresignedUrlQuery(imageKey);

  if (isPending) {
    return <Skeleton className="h-16 w-16 rounded-md" />;
  }
  if (isError || !data) {
    return null;
  }

  return (
    // `next/image` no se usa en ningún lado de este repo todavía (ver Avatar/AvatarImage, que
    // también renderiza un <img> plano) — no se introduce acá para una sola miniatura.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={data.url}
      alt={t('detail.progressLog.photoAlt')}
      className="h-16 w-16 rounded-md object-cover"
    />
  );
}
