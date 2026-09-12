import { SidebarTrigger } from '@/components/ui/sidebar';
import { GlobalSearch } from '@/features/global-search/components/global-search';
import { NotificationBell } from '@/features/notifications/components/notification-bell';
import type { SidebarVariant } from './app-sidebar';
import { LanguageSwitcher } from './language-switcher';
import { ThemeToggle } from './theme-toggle';
import { UserMenu } from './user-menu';

interface TopbarProps {
  userName: string;
  userEmail: string;
  userAvatarUrl?: string | null;
  // La búsqueda global es una herramienta de staff (busca en /users, gateado por USER.READ, y
  // /professionals) — solo tiene sentido en el modo admin, nunca en pro/cliente.
  variant?: SidebarVariant;
}

export function Topbar({
  userName,
  userEmail,
  userAvatarUrl,
  variant = 'client',
}: TopbarProps) {
  return (
    <header className="border-border bg-background/95 sticky top-0 z-10 flex h-14 items-center justify-between border-b px-4 backdrop-blur before:absolute before:inset-x-0 before:top-0 before:h-0.5 before:bg-gradient-to-r before:from-primary before:to-accent">
      <SidebarTrigger />
      <div className="flex items-center gap-1">
        {variant === 'admin' && <GlobalSearch />}
        <LanguageSwitcher />
        <ThemeToggle />
        <NotificationBell />
        <UserMenu name={userName} email={userEmail} avatarUrl={userAvatarUrl} />
      </div>
    </header>
  );
}
