import { describe, expect, it } from 'vitest';
import {
  ADMIN_SECTIONS,
  PERMISSIONS,
  STAFF_PERMISSIONS,
  canAccessAdminSection,
  getAdminLandingPath,
  getAllowedAdminSections,
  hasAnyPermission,
  isStaffUser,
} from './permissions';

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

  it('reconoce como staff a compliance (solo permisos legal.*)', () => {
    expect(
      isStaffUser([
        PERMISSIONS.LEGAL.CONFIG_MANAGE,
        PERMISSIONS.LEGAL.CONSENT_AUDIT_VIEW,
      ]),
    ).toBe(true);
  });

  it('no reconoce como staff a un usuario sin ningun permiso de staff', () => {
    expect(isStaffUser([])).toBe(false);
    expect(isStaffUser([PERMISSIONS.USER.CREATE, 'otro:permiso'])).toBe(false);
  });

  it('STAFF_PERMISSIONS incluye cada permiso exigido por alguna seccion', () => {
    for (const section of ADMIN_SECTIONS) {
      for (const permission of section.permissions) {
        expect(STAFF_PERMISSIONS).toContain(permission);
      }
    }
  });
});

describe('gate por seccion del backoffice', () => {
  const compliance = [
    PERMISSIONS.LEGAL.CONFIG_MANAGE,
    PERMISSIONS.LEGAL.CONSENT_AUDIT_VIEW,
  ];

  it('admin:all accede a todas las secciones', () => {
    const all = getAllowedAdminSections([PERMISSIONS.ADMIN.ALL]);
    expect(all).toHaveLength(ADMIN_SECTIONS.length);
  });

  it('compliance solo accede a las 3 secciones legales', () => {
    const ids = getAllowedAdminSections(compliance).map((s) => s.id);
    expect(ids).toEqual([
      'legalDocumentVersions',
      'dataRetentionPolicies',
      'consentAudit',
    ]);
    expect(canAccessAdminSection(compliance, 'users')).toBe(false);
    expect(canAccessAdminSection(compliance, 'dashboard')).toBe(false);
  });

  it('un permiso suelto solo abre su seccion', () => {
    expect(
      canAccessAdminSection([PERMISSIONS.PAYMENTS.AUDIT_VIEW], 'payments'),
    ).toBe(true);
    expect(
      canAccessAdminSection([PERMISSIONS.PAYMENTS.AUDIT_VIEW], 'ratings'),
    ).toBe(false);
  });

  it('dashboard:read abre el dashboard y las secciones sin permiso propio', () => {
    const perms = [PERMISSIONS.DASHBOARD];
    expect(canAccessAdminSection(perms, 'dashboard')).toBe(true);
    expect(canAccessAdminSection(perms, 'services')).toBe(true);
    expect(canAccessAdminSection(perms, 'auditLog')).toBe(false);
  });

  it('getAdminLandingPath: /admin para admin, la primera seccion permitida para el resto, null sin staff', () => {
    expect(getAdminLandingPath([PERMISSIONS.ADMIN.ALL])).toBe('/admin');
    expect(getAdminLandingPath(compliance)).toBe(
      '/admin/legal/document-versions',
    );
    expect(getAdminLandingPath([PERMISSIONS.LEGAL.CONSENT_AUDIT_VIEW])).toBe(
      '/admin/legal/consent-audit',
    );
    expect(getAdminLandingPath([])).toBeNull();
  });
});
