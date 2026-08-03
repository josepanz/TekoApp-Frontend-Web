'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import { NAV_ITEMS } from './nav-items';
import { PRO_NAV_ITEMS } from './pro-nav-items';
import { CLIENT_NAV_ITEMS } from './client-nav-items';
import { ModeSwitcher } from './mode-switcher';

export type SidebarVariant = 'admin' | 'pro' | 'client';

// `label` sale de `layout.brand.<variant>` y los títulos de item de `layout.nav.<variant>` —
// la marca ("TekoApp") no se traduce, pero vive igual en los mensajes para no partir el label
// entre dos fuentes distintas.
const VARIANT_CONFIG = {
  admin: { items: NAV_ITEMS },
  pro: { items: PRO_NAV_ITEMS },
  client: { items: CLIENT_NAV_ITEMS },
} as const;

interface AppSidebarProps {
  variant?: SidebarVariant;
}

// Reusado por las 3 áreas (admin/pro/cliente). Recibe un `variant` (string, serializable) en vez
// de la lista de nav items directamente — los layouts que lo usan son Server Components, y pasar
// `NavItem[]` (con el ícono como referencia a un componente/función) como prop desde un Server
// Component a este Client Component rompe en runtime ("Functions cannot be passed directly to
// Client Components"). Los items + íconos se resuelven acá adentro, nunca cruzan el límite RSC.
export function AppSidebar({ variant = 'admin' }: AppSidebarProps) {
  const pathname = usePathname();
  const t = useTranslations('layout');
  // Translator raíz: los items de nav guardan la clave completa (`layout.nav.<área>.<item>`).
  const tRoot = useTranslations();
  const { items } = VARIANT_CONFIG[variant];
  const label = t(`brand.${variant}`);

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="px-3 py-4">
        <span className="font-heading text-primary text-lg font-semibold tracking-tight group-data-[collapsible=icon]:hidden">
          {label}
        </span>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map(({ titleKey, href, icon: Icon }) => {
                const isActive =
                  pathname === href || pathname.startsWith(`${href}/`);
                const title = tRoot(titleKey);
                return (
                  <SidebarMenuItem key={href}>
                    <SidebarMenuButton
                      isActive={isActive}
                      tooltip={title}
                      render={
                        <Link href={href}>
                          <Icon />
                          <span>{title}</span>
                        </Link>
                      }
                    />
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarSeparator />
        <SidebarGroup>
          <SidebarGroupLabel>{t('modeSwitcher.groupLabel')}</SidebarGroupLabel>
          <SidebarGroupContent>
            <ModeSwitcher current={variant} />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarFooter>
    </Sidebar>
  );
}
