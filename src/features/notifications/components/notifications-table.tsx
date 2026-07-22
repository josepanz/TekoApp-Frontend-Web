'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { DataTable } from '@/components/layout/data-table';
import {
  useMarkNotificationAsReadMutation,
  useNotificationsQuery,
} from '../hooks';
import type { Notification, NotificationType } from '../api';

const TYPE_LABEL: Record<NotificationType, string> = {
  service_request: 'Solicitud de servicio',
  service_accepted: 'Servicio aceptado',
  service_rejected: 'Servicio rechazado',
  service_completed: 'Servicio completado',
  payment_received: 'Pago recibido',
  rating_received: 'Calificación recibida',
  promotion: 'Promoción',
  system: 'Sistema',
};

const TYPE_VARIANT: Record<
  NotificationType,
  'default' | 'secondary' | 'destructive' | 'outline'
> = {
  service_request: 'secondary',
  service_accepted: 'default',
  service_rejected: 'destructive',
  service_completed: 'default',
  payment_received: 'default',
  rating_received: 'secondary',
  promotion: 'outline',
  system: 'outline',
};

const MESSAGE_TRUNCATE_LENGTH = 80;

function truncateMessage(message: string): string {
  return message.length > MESSAGE_TRUNCATE_LENGTH
    ? `${message.slice(0, MESSAGE_TRUNCATE_LENGTH)}…`
    : message;
}

const DEFAULT_LIMIT = 20;
const LIMIT_STEP = 20;

export function NotificationsTable() {
  const [limit, setLimit] = useState(DEFAULT_LIMIT);
  const { data, isPending, isError } = useNotificationsQuery({ limit });
  const markAsReadMutation = useMarkNotificationAsReadMutation();

  if (isPending) {
    return <Skeleton className="h-64" />;
  }

  if (isError) {
    return (
      <p className="text-muted-foreground">
        No se pudo cargar el log de notificaciones. Intentá recargar la página.
      </p>
    );
  }

  const columns: ColumnDef<Notification, unknown>[] = [
    {
      accessorKey: 'title',
      header: 'Título',
    },
    {
      id: 'message',
      header: 'Mensaje',
      cell: ({ row }) => (
        <span title={row.original.message}>
          {truncateMessage(row.original.message)}
        </span>
      ),
    },
    {
      accessorKey: 'type',
      header: 'Tipo',
      cell: ({ row }) => (
        <Badge variant={TYPE_VARIANT[row.original.type]}>
          {TYPE_LABEL[row.original.type]}
        </Badge>
      ),
    },
    {
      id: 'read',
      header: 'Leída',
      cell: ({ row }) => (
        <Badge
          variant={row.original.status === 'read' ? 'secondary' : 'default'}
        >
          {row.original.status === 'read' ? 'Sí' : 'No'}
        </Badge>
      ),
    },
    {
      accessorKey: 'createdAt',
      header: 'Fecha',
      cell: ({ row }) =>
        new Date(row.original.createdAt).toLocaleDateString('es-PY'),
    },
    {
      id: 'actions',
      header: 'Acciones',
      cell: ({ row }) =>
        row.original.status !== 'read' ? (
          <Button
            size="sm"
            variant="outline"
            disabled={
              markAsReadMutation.isPending &&
              markAsReadMutation.variables === row.original.id
            }
            onClick={() => markAsReadMutation.mutate(row.original.id)}
          >
            Marcar como leída
          </Button>
        ) : null,
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <DataTable
        columns={columns}
        data={data}
        emptyMessage="No hay notificaciones para mostrar"
      />

      {data.length >= limit && (
        <div className="flex justify-center">
          <Button
            variant="outline"
            onClick={() => setLimit((prev) => prev + LIMIT_STEP)}
          >
            Cargar más
          </Button>
        </div>
      )}
    </div>
  );
}
