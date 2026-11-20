import { useQuery } from '@tanstack/react-query';
import { ApiError } from '@/core/api-client/errors';
import { getPresignedUrl } from './api';

// Misma queryKey que usan `professional-documents`, `professional-portfolio` y `service-progress`
// para que compartan cache.
export function usePresignedFileQuery(key: string, enabled = true) {
  return useQuery({
    queryKey: ['uploads', 'presigned-url', key],
    queryFn: () => getPresignedUrl(key),
    enabled: enabled && !!key,
    // Un 403/404 del presigned lo resuelve el componente (placeholder): no debe tumbar la pagina
    // entera con la pantalla de sin acceso del error boundary.
    throwOnError: false,
    // 403/404 no se arreglan reintentando: se muestra el placeholder de inmediato.
    retry: (failureCount, error) =>
      !(error instanceof ApiError && error.status < 500) && failureCount < 2,
  });
}
