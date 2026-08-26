import {
  Bell,
  CreditCard,
  FolderTree,
  LayoutDashboard,
  MapPin,
  Percent,
  ShieldCheck,
  Sparkles,
  Star,
  UserCog,
  Users,
  Wrench,
} from 'lucide-react';

// Clave de traducción COMPLETA (no el label literal): estos módulos son plain TS y no pueden
// llamar hooks — la traducción la resuelve AppSidebar con el translator raíz. Se tipa contra el
// catálogo real para que `pnpm check:types` falle si una clave de nav no existe en messages/es.json.
type NavMessages =
  (typeof import('../../../messages/es.json'))['layout']['nav'];

export type NavTitleKey =
  | `layout.nav.admin.${keyof NavMessages['admin'] & string}`
  | `layout.nav.client.${keyof NavMessages['client'] & string}`
  | `layout.nav.pro.${keyof NavMessages['pro'] & string}`;

export interface NavItem {
  titleKey: NavTitleKey;
  href: string;
  icon: typeof LayoutDashboard;
}

// Un item por dominio del backend (paralelo a features/<dominio>) — se van habilitando a
// medida que cada dominio se implementa (ver Fase 4 del plan). El orden importa: los más usados
// en el día a día del equipo primero.
export const NAV_ITEMS: NavItem[] = [
  {
    titleKey: 'layout.nav.admin.dashboard',
    href: '/admin',
    icon: LayoutDashboard,
  },
  { titleKey: 'layout.nav.admin.users', href: '/admin/users', icon: Users },
  {
    titleKey: 'layout.nav.admin.professionals',
    href: '/admin/professionals',
    icon: UserCog,
  },
  {
    titleKey: 'layout.nav.admin.services',
    href: '/admin/services',
    icon: Wrench,
  },
  {
    titleKey: 'layout.nav.admin.payments',
    href: '/admin/payments',
    icon: CreditCard,
  },
  {
    titleKey: 'layout.nav.admin.promotions',
    href: '/admin/promotions',
    icon: Percent,
  },
  { titleKey: 'layout.nav.admin.ratings', href: '/admin/ratings', icon: Star },
  {
    titleKey: 'layout.nav.admin.rolesPermission',
    href: '/admin/roles-permission',
    icon: ShieldCheck,
  },
  {
    titleKey: 'layout.nav.admin.categories',
    href: '/admin/categories',
    icon: FolderTree,
  },
  {
    titleKey: 'layout.nav.admin.locations',
    href: '/admin/locations',
    icon: MapPin,
  },
  {
    titleKey: 'layout.nav.admin.notifications',
    href: '/admin/notifications',
    icon: Bell,
  },
  {
    titleKey: 'layout.nav.admin.aiDisclosures',
    href: '/admin/ai-disclosures',
    icon: Sparkles,
  },
];
