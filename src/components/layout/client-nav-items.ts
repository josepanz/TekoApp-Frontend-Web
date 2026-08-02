import { Home, Search, Send, Wrench } from 'lucide-react';
import type { NavItem } from './nav-items';

// `titleKey` es relativo al namespace `layout.nav.client` — ver NavItem en ./nav-items.
export const CLIENT_NAV_ITEMS: NavItem[] = [
  { titleKey: 'layout.nav.client.home', href: '/', icon: Home },
  { titleKey: 'layout.nav.client.request', href: '/solicitar', icon: Send },
  {
    titleKey: 'layout.nav.client.myServices',
    href: '/mis-servicios',
    icon: Wrench,
  },
  {
    titleKey: 'layout.nav.client.professionals',
    href: '/profesionales',
    icon: Search,
  },
];
