'use client';

import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useAppLocale } from '@/i18n/use-app-locale';
import { formatDate } from '@/lib/formatters';
import type { AuditLogEntry } from '../api';

interface AuditLogDetailDialogProps {
  entry: AuditLogEntry;
}

// Diff formateado como JSON legible (`<pre>`), no una librería de diff visual nueva: no se
// justifica la complejidad para el volumen de uso esperado (staff técnico, uso ocasional) — ver
// admin-audit-log-viewer.md.
export function AuditLogDetailDialog({ entry }: AuditLogDetailDialogProps) {
  const t = useTranslations('auditLog');
  const locale = useAppLocale();

  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button variant="outline" size="sm">
            {t('detail.trigger')}
          </Button>
        }
      />
      <DialogContent className="max-h-[80vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('detail.title')}</DialogTitle>
          <DialogDescription>
            {t('detail.description', {
              table: entry.tableName,
              record: entry.recordId,
            })}
          </DialogDescription>
        </DialogHeader>

        <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
          <dt className="text-muted-foreground">{t('table.operation')}</dt>
          <dd>{entry.operationType}</dd>

          <dt className="text-muted-foreground">{t('table.changedBy')}</dt>
          <dd>{entry.changedBy}</dd>

          <dt className="text-muted-foreground">{t('table.changedAt')}</dt>
          <dd>{formatDate(entry.changedAt, locale)}</dd>

          {entry.reason && (
            <>
              <dt className="text-muted-foreground">{t('detail.reason')}</dt>
              <dd>{entry.reason}</dd>
            </>
          )}
        </dl>

        <div className="flex flex-col gap-3">
          <div>
            <p className="mb-1 text-sm font-medium">{t('detail.oldData')}</p>
            <pre className="max-h-48 overflow-auto rounded-md bg-muted p-3 text-xs">
              {entry.oldData ? JSON.stringify(entry.oldData, null, 2) : '—'}
            </pre>
          </div>
          <div>
            <p className="mb-1 text-sm font-medium">{t('detail.newData')}</p>
            <pre className="max-h-48 overflow-auto rounded-md bg-muted p-3 text-xs">
              {entry.newData ? JSON.stringify(entry.newData, null, 2) : '—'}
            </pre>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
