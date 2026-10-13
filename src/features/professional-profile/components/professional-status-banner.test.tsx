/**
 * Suite: ProfessionalStatusBanner: aviso del estado de la postulacion del profesional
 * Casos: CP-WEB-ONB-005 (ver test/qa/casos/CP-ONB.md)
 * Tipo: unitaria (componente + MSW)   Prioridad: P1
 * Precondiciones: handlers MSW de professional-mode; sin backend real.
 * Trazabilidad: DEF-WEB-005, plan maestro M3/M4.
 */
import { render, screen } from '@/test/render';
import { describe, expect, it } from 'vitest';
import { ProfessionalStatusBanner } from './professional-status-banner';

describe('ProfessionalStatusBanner', () => {
  it('CP-WEB-ONB-005 avisa que la postulación está pendiente de aprobación y que no puede ver solicitudes', () => {
    // Arrange & Act
    render(<ProfessionalStatusBanner status="PENDING" />);

    // Assert
    expect(
      screen.getByText('Tu postulación está pendiente de aprobación'),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/no podés ver ni aceptar solicitudes/),
    ).toBeInTheDocument();
  });

  it('CP-WEB-ONB-005 avisa cuando la cuenta está suspendida', () => {
    // Arrange & Act
    render(<ProfessionalStatusBanner status="SUSPENDED" />);

    // Assert
    expect(
      screen.getByText('Tu cuenta profesional está suspendida'),
    ).toBeInTheDocument();
  });

  it('CP-WEB-ONB-005 no muestra nada si el profesional está aprobado', () => {
    // Arrange & Act
    render(<ProfessionalStatusBanner status="APPROVED" />);

    // Assert
    expect(screen.queryByTestId('professional-status-banner')).toBeNull();
  });
});
