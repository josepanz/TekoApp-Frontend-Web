import { useQuery } from '@tanstack/react-query';
import { getPresignedUrl, getServiceProgress } from './api';

export function useServiceProgressQuery(serviceId: string) {
  return useQuery({
    queryKey: ['services', 'progress', serviceId],
    queryFn: () => getServiceProgress(serviceId),
  });
}

export function usePresignedUrlQuery(key: string) {
  return useQuery({
    queryKey: ['uploads', 'presigned-url', key],
    queryFn: () => getPresignedUrl(key),
    // Un 403/404 del presigned lo resuelve el componente (placeholder): no debe tumbar la pagina
    // entera con la pantalla de sin acceso del error boundary.
    throwOnError: false,
  });
}
