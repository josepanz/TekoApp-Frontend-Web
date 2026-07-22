import {
  Bell,
  CreditCard,
  FolderTree,
  LayoutDashboard,
  MapPin,
  Percent,
  ShieldCheck,
  Star,
  UserCog,
  Users,
  Wrench,
} from 'lucide-react';

export interface NavItem {
  title: string;
  href: string;
  icon: typeof LayoutDashboard;
}

// Un item por dominio del backend (paralelo a features/<dominio>) — se van habilitando a
// medida que cada dominio se implementa (ver Fase 4 del plan). El orden importa: los más usados
// en el día a día del equipo primero.
export const NAV_ITEMS: NavItem[] = [
  { title: 'Resumen', href: '/admin', icon: LayoutDashboard },
  { title: 'Usuarios', href: '/admin/users', icon: Users },
  { title: 'Profesionales', href: '/admin/professionals', icon: UserCog },
  { title: 'Servicios', href: '/admin/services', icon: Wrench },
  { title: 'Pagos', href: '/admin/payments', icon: CreditCard },
  { title: 'Promociones', href: '/admin/promotions', icon: Percent },
  { title: 'Calificaciones', href: '/admin/ratings', icon: Star },
  {
    title: 'Roles y permisos',
    href: '/admin/roles-permission',
    icon: ShieldCheck,
  },
  { title: 'Categorías', href: '/admin/categories', icon: FolderTree },
  { title: 'Ubicaciones', href: '/admin/locations', icon: MapPin },
  { title: 'Notificaciones', href: '/admin/notifications', icon: Bell },
];
