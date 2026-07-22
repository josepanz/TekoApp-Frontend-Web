import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  createNotification,
  getNotifications,
  markNotificationAsRead,
  type CreateNotificationRequest,
  type GetNotificationsParams,
} from './api';

export function useNotificationsQuery(params: GetNotificationsParams = {}) {
  return useQuery({
    queryKey: ['notifications', params],
    queryFn: () => getNotifications(params),
  });
}

export function useCreateNotificationMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: CreateNotificationRequest) => createNotification(dto),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['notifications'] });
      toast.success('Notificación creada correctamente.');
    },
    onError: () => {
      toast.error('No se pudo crear la notificación. Intentá de nuevo.');
    },
  });
}

export function useMarkNotificationAsReadMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => markNotificationAsRead(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['notifications'] });
      toast.success('Notificación marcada como leída.');
    },
    onError: () => {
      toast.error(
        'No se pudo marcar la notificación como leída. Intentá de nuevo.',
      );
    },
  });
}
