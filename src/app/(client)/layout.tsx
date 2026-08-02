import { redirect } from 'next/navigation';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { Topbar } from '@/components/layout/topbar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { getSession } from '@/core/auth/session';

// Modo Cliente — sin gate de permisos ni de perfil: todo usuario autenticado es cliente
// implícito (ver decisión de IA en el plan), a diferencia de /admin (permisos) y /pro
// (perfil profesional).
export default async function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) {
    redirect('/login');
  }

  return (
    <SidebarProvider>
      <AppSidebar variant="client" />
      <SidebarInset>
        <Topbar
          userName={`${session.firstName} ${session.lastName}`.trim()}
          userEmail={session.email}
          userAvatarUrl={session.avatarUrl}
        />
        <main className="flex flex-1 flex-col gap-4 p-4 md:p-6">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
