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
import { BRAND_NAME } from '@/design-system/tokens/brand';
import { getAllowedAdminSections } from '@/core/auth/permissions';
import { NAV_ITEMS, type NavItem } from './nav-items';
import { PRO_NAV_ITEMS } from './pro-nav-items';
import { CLIENT_NAV_ITEMS } from './client-nav-items';
import { ModeSwitcher, useOtherModes } from './mode-switcher';

export type SidebarVariant = 'admin' | 'pro' | 'client';

// `label` sale de `layout.brand.<variant>` (plantilla con placeholder `{brand}`) y los títulos de
// item de `layout.nav.<variant>` — el nombre de marca no se traduce (mismo string en es/en), pero
// se interpola desde `BRAND_NAME` (`design-system/tokens/brand.ts`) en vez de vivir hardcodeado en
// los 2 catálogos de mensajes.
const VARIANT_CONFIG = {
  admin: { items: NAV_ITEMS },
  pro: { items: PRO_NAV_ITEMS },
  client: { items: CLIENT_NAV_ITEMS },
} as const;

interface AppSidebarProps {
  variant?: SidebarVariant;
  // Permisos del usuario (serializables, vienen del layout server). En `admin` filtran los items
  // a las secciones permitidas; si se omiten se muestran todos (stories/tests de otras variantes).
  permissions?: readonly string[];
}

// Reusado por las 3 áreas (admin/pro/cliente). Recibe un `variant` (string, serializable) en vez
// de la lista de nav items directamente — los layouts que lo usan son Server Components, y pasar
// `NavItem[]` (con el ícono como referencia a un componente/función) como prop desde un Server
// Component a este Client Component rompe en runtime ("Functions cannot be passed directly to
// Client Components"). Los items + íconos se resuelven acá adentro, nunca cruzan el límite RSC.
/** En `admin`, deja solo los items de las secciones que `permissions` habilita. */
export function filterNavItems(
  variant: SidebarVariant,
  items: readonly NavItem[],
  permissions: readonly string[] | undefined,
): readonly NavItem[] {
  if (variant !== 'admin' || !permissions) return items;
  const allowed = new Set<string>(
    getAllowedAdminSections(permissions).map((section) => section.href),
  );
  return items.filter((item) => allowed.has(item.href));
}

export function AppSidebar({
  variant = 'admin',
  permissions,
}: AppSidebarProps) {
  const pathname = usePathname();
  const t = useTranslations('layout');
  // Translator raíz: los items de nav guardan la clave completa (`layout.nav.<área>.<item>`).
  const tRoot = useTranslations();
  const allItems = VARIANT_CONFIG[variant].items;
  const items = filterNavItems(variant, allItems, permissions);
  const label = t(`brand.${variant}`, { brand: BRAND_NAME });
  const otherModes = useOtherModes(variant);

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
      {otherModes.length > 0 && (
        <SidebarFooter>
          <SidebarSeparator />
          <SidebarGroup>
            <SidebarGroupLabel>
              {t('modeSwitcher.groupLabel')}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <ModeSwitcher current={variant} />
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarFooter>
      )}
    </Sidebar>
  );
}
