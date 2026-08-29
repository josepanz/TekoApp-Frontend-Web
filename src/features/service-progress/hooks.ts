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
  });
}
