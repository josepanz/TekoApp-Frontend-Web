import { ClipboardList, Star, User, Wrench } from 'lucide-react';
import type { NavItem } from './nav-items';

// `titleKey` es relativo al namespace `layout.nav.pro` — ver NavItem en ./nav-items.
export const PRO_NAV_ITEMS: NavItem[] = [
  {
    titleKey: 'layout.nav.pro.requests',
    href: '/pro/solicitudes',
    icon: ClipboardList,
  },
  {
    titleKey: 'layout.nav.pro.myServices',
    href: '/pro/servicios',
    icon: Wrench,
  },
  {
    titleKey: 'layout.nav.pro.ratings',
    href: '/pro/calificaciones',
    icon: Star,
  },
  { titleKey: 'layout.nav.pro.profile', href: '/pro/perfil', icon: User },
];
