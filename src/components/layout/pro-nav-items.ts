import { ClipboardList, Star, User, Wrench } from 'lucide-react';
import type { NavItem } from './nav-items';

export const PRO_NAV_ITEMS: NavItem[] = [
  { title: 'Solicitudes', href: '/pro/solicitudes', icon: ClipboardList },
  { title: 'Mis servicios', href: '/pro/servicios', icon: Wrench },
  { title: 'Calificaciones', href: '/pro/calificaciones', icon: Star },
  { title: 'Perfil', href: '/pro/perfil', icon: User },
];
