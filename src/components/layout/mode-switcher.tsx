'use client';

import Link from 'next/link';
import { ShieldCheck, User, Wrench } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useSessionScopeQuery } from '@/core/auth/hooks';
import { useMyProfessionalProfileQuery } from '@/features/professional-profile/hooks';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import type { SidebarVariant } from './app-sidebar';

const MODE_ICON = {
  client: User,
  pro: Wrench,
  admin: ShieldCheck,
} as const;

const MODE_HREF: Record<SidebarVariant, string> = {
  client: '/',
  pro: '/pro',
  admin: '/admin',
};

// Calcula a qué otros modos puede saltar el usuario actual — extraído para que `AppSidebar` pueda
// decidir si vale la pena mostrar el grupo "Cambiar de modo" (label + separador) ANTES de
// renderizar `ModeSwitcher`, que hasta ahora era el único que sabía si no había nada que ofrecer
// (devolvía `null`) dejando el label del grupo huérfano para un usuario de un solo modo.
export function useOtherModes(current: SidebarVariant): SidebarVariant[] {
  const { data: scope } = useSessionScopeQuery();
  const { data: professional, isError: noProfessionalProfile } =
    useMyProfessionalProfileQuery();

  const isStaff = scope?.permissions.some(
    (p) => p.name === 'admin:all' || p.name === 'dashboard:read',
  );
  const isProfessional = !!professional && !noProfessionalProfile;

  const modes: SidebarVariant[] = ['client'];
  if (isProfessional) modes.push('pro');
  if (isStaff) modes.push('admin');

  return modes.filter((mode) => mode !== current);
}

// Selector de modo — visible en el sidebar de las 3 áreas para poder ir de una a otra sin volver
// a "/" manualmente (antes solo existía el link de entrada en la home del cliente). El gate real
// lo sigue haciendo cada layout (permisos para /admin, perfil profesional para /pro) — esto solo
// oculta el link cuando ya sabemos que no corresponde, para no ofrecer un camino que va a rebotar.
export function ModeSwitcher({ current }: { current: SidebarVariant }) {
  const t = useTranslations('layout.modeSwitcher');
  const otherModes = useOtherModes(current);
  if (otherModes.length === 0) return null;

  return (
    <SidebarMenu>
      {otherModes.map((mode) => {
        const Icon = MODE_ICON[mode];
        const label = t(mode);
        return (
          <SidebarMenuItem key={mode}>
            <SidebarMenuButton
              tooltip={label}
              render={
                <Link href={MODE_HREF[mode]}>
                  <Icon />
                  <span>{label}</span>
                </Link>
              }
            />
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
}
