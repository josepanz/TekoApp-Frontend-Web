'use client';

import type { ColumnDef } from '@tanstack/react-table';
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
const columns: ColumnDef<Role, unknown>[] = [
  {
    accessorKey: 'name',
    header: 'Nombre',
  },
  {
    id: 'description',
    header: 'Descripción',
    cell: ({ row }) => row.original.description ?? '—',
  },
  {
    id: 'status',
    header: 'Estado',
    cell: ({ row }) => (
      <Badge variant={row.original.isActive ? 'default' : 'secondary'}>
        {row.original.isActive ? 'Activo' : 'Inactivo'}
      </Badge>
    ),
  },
  {
    id: 'actions',
    header: 'Acciones',
    // No existe DELETE /roles/{id} en types.generated.ts -- solo se ofrece "Editar".
    cell: ({ row }) => (
      <RoleFormDialog
        role={row.original}
        trigger={
          <Button variant="outline" size="sm">
            Editar
          </Button>
        }
      />
    ),
  },
];

export function RolesTable() {
  const { data, isPending, isError } = useRolesQuery();

  if (isPending) {
    return <Skeleton className="h-64" />;
  }

  if (isError) {
    return (
      <p className="text-muted-foreground">
        No se pudo cargar la lista de roles. Intentá recargar la página.
      </p>
    );
  }

  return (
    <DataTable
      columns={columns}
      data={data.roles}
      emptyMessage="No hay roles para mostrar"
    />
  );
}
