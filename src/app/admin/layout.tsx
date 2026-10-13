import { redirect } from 'next/navigation';
import { AccessDenied } from '@/components/layout/access-denied';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { Topbar } from '@/components/layout/topbar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { getSession } from '@/core/auth/session';
import { isStaffUser } from '@/core/auth/permissions';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Defensivo: proxy.ts ya redirige a /login sin cookie de sesión, pero si el token expiró
  // justo entre el chequeo del proxy y este render, no queremos mostrar un shell vacío/roto.
  const session = await getSession();
  if (!session) {
    redirect('/login');
  }

  // Gate del modo Admin/staff: todo usuario autenticado es cliente implícito, pero solo quien
  // tiene al menos un permiso de staff entra al backoffice. Cada sección exige después el suyo
  // (`AdminSectionGate`, layout de cada carpeta). Sin ningún permiso: pantalla de "sin acceso".
  if (!isStaffUser(session.permissions)) {
    return <AccessDenied />;
  }

  return (
    <SidebarProvider>
      <AppSidebar variant="admin" permissions={session.permissions} />
      <SidebarInset>
        <Topbar
          userName={`${session.firstName} ${session.lastName}`.trim()}
          userEmail={session.email}
          userAvatarUrl={session.avatarUrl}
          variant="admin"
        />
        <main className="flex flex-1 flex-col gap-4 p-4 md:p-6">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
