import { redirect } from 'next/navigation';
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

  // Gate del modo Admin/staff: todo usuario autenticado es cliente implícito, pero solo el
  // staff (permisos admin/dashboard) entra al backoffice — ver decisión de IA en el plan.
  if (!isStaffUser(session.permissions)) {
    redirect('/');
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Topbar
          userName={`${session.firstName} ${session.lastName}`.trim()}
          userEmail={session.email}
        />
        <main className="flex flex-1 flex-col gap-4 p-4 md:p-6">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
