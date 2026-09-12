import { render, screen } from '@/test/render';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { buildAuditLogEntry } from '@/test/msw/handlers/audit-log';
import { AuditLogDetailDialog } from './audit-log-detail-dialog';

describe('AuditLogDetailDialog', () => {
  it('muestra el diff de oldData/newData y los metadatos del cambio al abrir', async () => {
    // Arrange
    const user = userEvent.setup();
    const entry = buildAuditLogEntry({
      reason: 'Corrección manual de disponibilidad',
    });
    render(<AuditLogDetailDialog entry={entry} />);

    // Act
    await user.click(screen.getByRole('button', { name: 'Ver' }));

    // Assert
    expect(await screen.findByText('Detalle del cambio')).toBeInTheDocument();
    expect(screen.getByText('staff-uuid-1')).toBeInTheDocument();
    expect(
      screen.getByText('Corrección manual de disponibilidad'),
    ).toBeInTheDocument();
    expect(screen.getByText(/"isAvailable": false/)).toBeInTheDocument();
    expect(screen.getByText(/"isAvailable": true/)).toBeInTheDocument();
  });

  it('muestra un guion cuando no hay oldData/newData (alta o baja)', async () => {
    // Arrange
    const user = userEvent.setup();
    const entry = buildAuditLogEntry({
      operationType: 'INSERT',
      oldData: undefined,
    });
    render(<AuditLogDetailDialog entry={entry} />);

    // Act
    await user.click(screen.getByRole('button', { name: 'Ver' }));

    // Assert
    await screen.findByText('Detalle del cambio');
    expect(screen.getByText('—')).toBeInTheDocument();
  });
});
