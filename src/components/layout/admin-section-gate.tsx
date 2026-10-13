import { redirect } from 'next/navigation';
import { AccessDenied } from '@/components/layout/access-denied';
import { getSession } from '@/core/auth/session';
import {
  canAccessAdminSection,
  getAdminLandingPath,
  type AdminSectionId,
} from '@/core/auth/permissions';

/**
 * Gate por seccion del backoffice (el layout de `/admin` solo exige ser staff). Sin el permiso de
 * la seccion: pantalla de sin acceso, salvo en el dashboard (`/admin`), donde se redirige a la
 * primera seccion permitida del usuario (ej. compliance -> Legal) en vez de mostrar un 403.
 */
export async function AdminSectionGate({
  section,
  children,
}: {
  section: AdminSectionId;
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) redirect('/login');

  if (canAccessAdminSection(session.permissions, section)) return children;

  if (section === 'dashboard') {
    const landing = getAdminLandingPath(session.permissions);
    if (landing && landing !== '/admin') redirect(landing);
  }
  return <AccessDenied embedded />;
}
