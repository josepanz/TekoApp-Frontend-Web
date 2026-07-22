import { Home, Search, Send, Wrench } from 'lucide-react';
import type { NavItem } from './nav-items';

export const CLIENT_NAV_ITEMS: NavItem[] = [
  { title: 'Inicio', href: '/', icon: Home },
  { title: 'Solicitar', href: '/solicitar', icon: Send },
  { title: 'Mis servicios', href: '/mis-servicios', icon: Wrench },
  { title: 'Profesionales', href: '/profesionales', icon: Search },
];
