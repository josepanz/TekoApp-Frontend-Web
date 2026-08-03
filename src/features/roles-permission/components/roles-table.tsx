'use client';

import type { ColumnDef } from '@tanstack/react-table';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { DataTable } from '@/components/layout/data-table';
import type { Role } from '../api';
import { useRolesQuery } from '../hooks';
import { RoleFormDialog } from './role-form-dialog';

// RoleResponseDTO (confirmado en types.generated.ts) no expone un arreglo ni una cantidad de
// permisos del rol -- el único conteo de permisos que existe hoy en el Swagger vive en
// UserWithRolesResponseDTO.permissionsCount, que pertenece al endpoint de permisos POR USUARIO
// (fuera de alcance de esta pasada). Se muestra el estado (isActive) en su lugar, que sí es un
// campo real de la respuesta.
export function RolesTable() {
  const t = useTranslations('rolesPermission');
  const tCommon = useTranslations('common');
  const { data, isPending, isError } = useRolesQuery();

  const columns: ColumnDef<Role, unknown>[] = [
    {
      accessorKey: 'name',
      header: t('table.name'),
    },
    {
      id: 'description',
      header: t('table.description'),
      cell: ({ row }) => row.original.description ?? '—',
    },
    {
      id: 'status',
      header: t('table.status'),
      cell: ({ row }) => (
        <Badge variant={row.original.isActive ? 'default' : 'secondary'}>
          {row.original.isActive ? t('table.active') : t('table.inactive')}
        </Badge>
      ),
    },
    {
      id: 'actions',
      header: t('table.actions'),
      // No existe DELETE /roles/{id} en types.generated.ts -- solo se ofrece "Editar".
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            nativeButton={false}
            render={
              <Link href={`/admin/roles-permission/${row.original.id}`}>
                {tCommon('actions.view')}
              </Link>
            }
          />
          <RoleFormDialog
            role={row.original}
            trigger={
              <Button variant="outline" size="sm">
                {tCommon('actions.edit')}
              </Button>
            }
          />
        </div>
      ),
    },
  ];

  if (isPending) {
    return <Skeleton className="h-64" />;
  }

  if (isError) {
    return <p className="text-muted-foreground">{t('table.loadError')}</p>;
  }

  return (
    <DataTable
      columns={columns}
      data={data.roles}
      emptyMessage={t('table.empty')}
    />
  );
}
