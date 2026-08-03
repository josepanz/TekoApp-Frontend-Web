'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { useMyProfessionalProfileQuery } from '../hooks';

// Gate de acceso al modo Profesional: no hay un rol/claim "profesional" en el JWT — se determina
// consultando GET /professionals/me una vez (cacheado por TanStack Query) y redirigiendo a "/"
// si el usuario autenticado no tiene perfil profesional (404).
export function ProfessionalGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isPending, isError } = useMyProfessionalProfileQuery();

  useEffect(() => {
    if (isError) {
      router.replace('/');
    }
  }, [isError, router]);

  if (isPending) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">
        <Skeleton className="h-64" />
      </div>
    );
  }

  if (isError) {
    return null;
  }

  return <>{children}</>;
}
