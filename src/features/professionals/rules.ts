import type { Professional } from './api';

// Contrato del backend: `verify` solo aplica a PENDING/REJECTED (APPROVED y SUSPENDED -> 409) y
// `suspend` solo a APPROVED (resto -> 409). La UI oculta la accion que el backend rechazaria (DEF-WEB-013).
export function canVerifyProfessional(status: Professional['status']): boolean {
  return status === 'PENDING' || status === 'REJECTED';
}

export function canSuspendProfessional(
  status: Professional['status'],
): boolean {
  return status === 'APPROVED';
}
