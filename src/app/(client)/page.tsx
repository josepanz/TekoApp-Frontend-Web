import Link from 'next/link';
import { getSession } from '@/core/auth/session';
import { isStaffUser } from '@/core/auth/permissions';
import { ProModeLink } from '@/features/professional-profile/components/pro-mode-link';

// Home del modo Cliente — el layout ((client)/layout.tsx) ya valida la sesión.
export default async function ClientHomePage() {
  const session = await getSession();
  const showAdminLink = session ? isStaffUser(session.permissions) : false;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight">
          Hola, {session?.firstName}
        </h1>
        <p className="text-muted-foreground">
          Solicitá un profesional, hacé seguimiento a tus servicios y calificá
          cuando termine el trabajo.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link
          href="/solicitar"
          className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-4 py-2 text-sm font-medium transition-colors"
        >
          Solicitar un profesional
        </Link>
        <Link
          href="/profesionales"
          className="border-input hover:bg-accent rounded-md border px-4 py-2 text-sm font-medium transition-colors"
        >
          Buscar profesionales
        </Link>
        <ProModeLink />
        {showAdminLink && (
          <Link
            href="/admin"
            className="border-input hover:bg-accent rounded-md border px-4 py-2 text-sm font-medium transition-colors"
          >
            Ir al panel de administración
          </Link>
        )}
      </div>
    </div>
  );
}
