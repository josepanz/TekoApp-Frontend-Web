import { redirect } from 'next/navigation';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { Topbar } from '@/components/layout/topbar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { getSession } from '@/core/auth/session';
import { ProfessionalGate } from '@/features/professional-profile/components/professional-gate';

export default async function ProLayout({
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
      <AppSidebar variant="pro" />
      <SidebarInset>
        <Topbar
          userName={`${session.firstName} ${session.lastName}`.trim()}
          userEmail={session.email}
          userAvatarUrl={session.avatarUrl}
        />
        <main className="flex flex-1 flex-col gap-4 p-4 md:p-6">
          <ProfessionalGate>{children}</ProfessionalGate>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
