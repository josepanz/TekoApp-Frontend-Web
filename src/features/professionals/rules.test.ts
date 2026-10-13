/**
 * Suite: reglas de transicion de profesionales (verificar / suspender)
 * Casos: CP-WEB-ONB-007 (ver test/qa/casos/CP-ONB.md)
 * Tipo: unitaria   Prioridad: P2
 * Precondiciones: ninguna.
 * Trazabilidad: DEF-WEB-013.
 */
import { describe, expect, it } from 'vitest';
import { canSuspendProfessional, canVerifyProfessional } from './rules';

describe('reglas de transicion de profesionales', () => {
  it('CP-WEB-ONB-007 verificar solo en PENDING y REJECTED', () => {
    expect(canVerifyProfessional('PENDING')).toBe(true);
    expect(canVerifyProfessional('REJECTED')).toBe(true);
    expect(canVerifyProfessional('APPROVED')).toBe(false);
    expect(canVerifyProfessional('SUSPENDED')).toBe(false);
  });
  it('CP-WEB-ONB-007 suspender solo en APPROVED', () => {
    expect(canSuspendProfessional('APPROVED')).toBe(true);
    expect(canSuspendProfessional('PENDING')).toBe(false);
    expect(canSuspendProfessional('REJECTED')).toBe(false);
    expect(canSuspendProfessional('SUSPENDED')).toBe(false);
  });
});
