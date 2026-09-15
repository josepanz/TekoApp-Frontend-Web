import { describe, expect, it } from 'vitest';
import { PERMISSIONS, hasAnyPermission, isStaffUser } from './permissions';

describe('PERMISSIONS', () => {
  it('espeja los 5 permisos de auditoria y gestion que agrego el backend', () => {
    // Arrange & Act & Assert
    expect(PERMISSIONS.PROFESSIONAL_PORTFOLIO.REVIEW).toBe(
      'professional-portfolio.review:manage',
    );
    expect(PERMISSIONS.PROFESSIONALS.VERIFY).toBe(
      'professionals.verification:manage',
    );
    expect(PERMISSIONS.CONTRACTS.AUDIT_VIEW).toBe('contracts.audit:read');
    expect(PERMISSIONS.RATINGS.AUDIT_VIEW).toBe('ratings.audit:read');
    expect(PERMISSIONS.PAYMENTS.AUDIT_VIEW).toBe('payments.audit:read');
  });
});

describe('hasAnyPermission', () => {
  it('devuelve true cuando el usuario tiene alguno de los permisos requeridos', () => {
    // Arrange
    const userPermissions = [PERMISSIONS.PAYMENTS.AUDIT_VIEW];

    // Act
    const result = hasAnyPermission(userPermissions, [
      PERMISSIONS.PAYMENTS.AUDIT_VIEW,
      PERMISSIONS.RATINGS.AUDIT_VIEW,
    ]);

    // Assert
    expect(result).toBe(true);
  });

  it('devuelve false cuando el usuario no tiene ninguno de los permisos requeridos', () => {
    // Arrange
    const userPermissions = [PERMISSIONS.DASHBOARD];

    // Act
    const result = hasAnyPermission(userPermissions, [
      PERMISSIONS.PAYMENTS.AUDIT_VIEW,
      PERMISSIONS.CONTRACTS.AUDIT_VIEW,
    ]);

    // Assert
    expect(result).toBe(false);
  });
});

describe('isStaffUser', () => {
  it('reconoce como staff a un usuario con admin:all', () => {
    // Arrange
    const userPermissions = [PERMISSIONS.ADMIN.ALL];

    // Act
    const result = isStaffUser(userPermissions);

    // Assert
    expect(result).toBe(true);
  });

  it('no reconoce como staff a un usuario sin admin:all ni dashboard:read', () => {
    // Arrange
    const userPermissions = [PERMISSIONS.PAYMENTS.AUDIT_VIEW];

    // Act
    const result = isStaffUser(userPermissions);

    // Assert
    expect(result).toBe(false);
  });
});
