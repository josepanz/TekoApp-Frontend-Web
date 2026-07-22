'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

/**
 * Boundary de error de la raíz — captura, entre otros casos, `SessionUnavailableError` lanzado
 * por `getSession()` (ver core/auth/session.ts) cuando el backend no responde o responde con un
 * error que no es 401. Sin este boundary, Next.js muestra su página de error genérica sin estilo.
 */
export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="font-heading text-2xl font-semibold">Algo salió mal</h1>
      <p className="text-muted-foreground max-w-md text-sm">
        No pudimos completar la solicitud. Puede ser un problema temporario del
        servidor — probá de nuevo en unos segundos.
      </p>
      <Button onClick={() => reset()}>Reintentar</Button>
    </div>
  );
}
