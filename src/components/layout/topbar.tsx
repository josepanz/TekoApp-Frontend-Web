import { SidebarTrigger } from '@/components/ui/sidebar';
import { LanguageSwitcher } from './language-switcher';
import { ThemeToggle } from './theme-toggle';
import { UserMenu } from './user-menu';

interface TopbarProps {
  userName: string;
  userEmail: string;
  userAvatarUrl?: string | null;
}

export function Topbar({ userName, userEmail, userAvatarUrl }: TopbarProps) {
  return (
    <header className="border-border bg-background/95 sticky top-0 z-10 flex h-14 items-center justify-between border-b px-4 backdrop-blur before:absolute before:inset-x-0 before:top-0 before:h-0.5 before:bg-gradient-to-r before:from-primary before:to-accent">
      <SidebarTrigger />
      <div className="flex items-center gap-1">
        <LanguageSwitcher />
        <ThemeToggle />
        <UserMenu name={userName} email={userEmail} avatarUrl={userAvatarUrl} />
      </div>
    </header>
  );
}
