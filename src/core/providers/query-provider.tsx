'use client';

import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { toast } from 'sonner';
import { ApiError } from '@/core/api-client/errors';

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const t = useTranslations('pages');
  const [queryClient] = useState(() => {
    // 429: aviso global con el tiempo de espera (`retryAfter`) en vez de un fallo silencioso.
    const notifyRateLimit = (error: unknown) => {
      if (error instanceof ApiError && error.status === 429) {
        toast.error(t('rateLimited', { seconds: error.retryAfter ?? 60 }), {
          id: 'rate-limited',
        });
      }
    };
    return new QueryClient({
      queryCache: new QueryCache({ onError: notifyRateLimit }),
      mutationCache: new MutationCache({ onError: notifyRateLimit }),
      defaultOptions: {
        queries: {
          staleTime: 30_000,
          retry: 1,
          // 403: se propaga al error boundary (`app/error.tsx`), que muestra "sin acceso".
          throwOnError: (error) =>
            error instanceof ApiError && error.status === 403,
        },
      },
    });
  });

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
