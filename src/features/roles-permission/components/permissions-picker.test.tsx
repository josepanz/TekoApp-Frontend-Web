import { render, screen } from '@/test/render';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { PERMISSIONS } from '@/core/auth/permissions';
import { PermissionsPicker } from './permissions-picker';

describe('PermissionsPicker', () => {
  it('agrupa los permisos por categoría y muestra los sueltos sin agrupar', () => {
    // Arrange & Act
    render(<PermissionsPicker value={[]} onChange={vi.fn()} />);

    // Assert
    expect(screen.getByText('USER')).toBeInTheDocument();
    expect(screen.getByText('ROLE')).toBeInTheDocument();
    expect(
      screen.getByRole('checkbox', { name: 'PASSWORD.CREATE' }),
    ).toBeInTheDocument();
  });

  it('llama a onChange agregando el permiso al togglear un checkbox sin marcar', async () => {
    // Arrange
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<PermissionsPicker value={[]} onChange={onChange} />);

    // Act
    await user.click(screen.getByRole('checkbox', { name: 'ALL' }));

    // Assert
    expect(onChange).toHaveBeenCalledWith([PERMISSIONS.ADMIN.ALL]);
  });

  it('llama a onChange quitando el permiso al destildar un checkbox marcado', async () => {
    // Arrange
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <PermissionsPicker value={[PERMISSIONS.DASHBOARD]} onChange={onChange} />,
    );

    // Act
    await user.click(screen.getByRole('checkbox', { name: 'DASHBOARD' }));

    // Assert
    expect(onChange).toHaveBeenCalledWith([]);
  });
});
