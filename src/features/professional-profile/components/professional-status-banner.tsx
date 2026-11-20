'use client';

import { Clock3, ShieldAlert } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import type { Professional } from '../api';

// El profesional tiene que ver en qué estado está su postulación (DEF-WEB-005): hasta ahora la Web
// solo mostraba el enum crudo `verificationStatus` en el perfil y ningún aviso de que, estando
// PENDING/REJECTED/SUSPENDED, el backend le niega ver y aceptar solicitudes (403).
export function ProfessionalStatusBanner({
  status,
}: {
  status: Professional['status'];
}) {
  const t = useTranslations('professionalProfile.statusBanner');
  if (status === 'APPROVED') return null;
  const Icon = status === 'PENDING' ? Clock3 : ShieldAlert;
  // Variante por defecto (texto con contraste AA sobre la tarjeta); el estado se comunica con el
  // borde, el icono y el texto, no solo con color (DEF-WEB-010: la variante `warning` daba 4.19:1).
  return (
    <Alert
      className={status === 'PENDING' ? 'border-warning' : 'border-destructive'}
      data-testid="professional-status-banner"
    >
      <Icon
        aria-hidden="true"
        className={status === 'PENDING' ? 'text-warning!' : 'text-destructive!'}
      />
      <AlertTitle>{t(`${status}.title`)}</AlertTitle>
      <AlertDescription>{t(`${status}.description`)}</AlertDescription>
    </Alert>
  );
}
