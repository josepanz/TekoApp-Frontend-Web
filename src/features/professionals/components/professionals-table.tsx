'use client';

import { Download } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { BulkActionsBar } from '@/components/layout/bulk-actions-bar';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/data-table';
import { useSessionScopeQuery } from '@/core/auth/hooks';
import { hasAnyPermission, PERMISSIONS } from '@/core/auth/permissions';
import {
  useExportProfessionalsMutation,
  useProfessionalsQuery,
} from '../hooks';
import { ProfessionalsBulkDialogs } from './professionals-bulk-dialogs';
import { useProfessionalsColumns } from './professionals-columns';

const PAGE_SIZE = 10;

export function ProfessionalsTable() {
  const t = useTranslations('professionals');
  const tCommon = useTranslations('common');
  const [page, setPage] = useState(1);
  const { data, isPending, isError, isFetching, refetch } =
    useProfessionalsQuery({
      page,
      pageSize: PAGE_SIZE,
    });
  const exportMutation = useExportProfessionalsMutation();
  const columns = useProfessionalsColumns();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkVerifyOpen, setBulkVerifyOpen] = useState(false);
  const [bulkSuspendOpen, setBulkSuspendOpen] = useState(false);

  function getSelectedItems() {
    if (!data) return [];
    return data.data.filter((item) => selectedIds.includes(String(item.id)));
  }

  // El export pega contra `PROFESSIONALS.VERIFY`/`ADMIN.ALL` en el backend (mismo permiso que
  // verificar/suspender) — la tabla en sí no está gateada (no todo staff que la ve puede
  // exportar), así que el botón se oculta solo si falta el permiso, sin tocar el resto de la
  // tabla.
  const { data: scope } = useSessionScopeQuery();
  const canExport = hasAnyPermission(
    (scope?.permissions ?? []).map((permission) => permission.name),
    [PERMISSIONS.PROFESSIONALS.VERIFY, PERMISSIONS.ADMIN.ALL],
  );

  return (
    <div className="flex flex-col gap-4">
      {canExport && (
        <div className="flex justify-end">
          <Button
            variant="outline"
            size="sm"
            disabled={exportMutation.isPending}
            onClick={() => exportMutation.mutate({})}
          >
            <Download />
            {exportMutation.isPending
              ? tCommon('states.generating')
              : tCommon('actions.export')}
          </Button>
        </div>
      )}

      <>
        <BulkActionsBar
          selectedCount={selectedIds.length}
          onCancel={() => setSelectedIds([])}
        >
          <Button size="sm" onClick={() => setBulkVerifyOpen(true)}>
            {t('bulk.verifyButton', { count: selectedIds.length })}
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setBulkSuspendOpen(true)}
          >
            {t('bulk.suspendButton', { count: selectedIds.length })}
          </Button>
        </BulkActionsBar>

        <DataTable
          columns={columns}
          data={data?.data ?? []}
          isLoading={isPending}
          isFetching={isFetching}
          isError={isError}
          errorMessage={t('table.loadError')}
          onRetry={() => void refetch()}
          emptyMessage={t('table.empty')}
          pagination={
            data
              ? {
                  page: data.pagination.page,
                  totalPages: data.pagination.totalPages,
                  onPageChange: setPage,
                }
              : undefined
          }
          selection={{
            selectedIds,
            onSelectionChange: setSelectedIds,
            getRowId: (row) => String(row.id),
          }}
        />
      </>

      <ProfessionalsBulkDialogs
        getSelectedItems={getSelectedItems}
        selectedCount={selectedIds.length}
        verifyOpen={bulkVerifyOpen}
        onVerifyOpenChange={setBulkVerifyOpen}
        suspendOpen={bulkSuspendOpen}
        onSuspendOpenChange={setBulkSuspendOpen}
        onFinished={() => setSelectedIds([])}
      />
    </div>
  );
}
