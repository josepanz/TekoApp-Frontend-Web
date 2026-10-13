/**
 * Suite: gate por seccion del backoffice (AdminSectionGate).
 * Casos: CP-WEB-AUTH-112..115 (ver test/qa/casos/CP-AUTH.md)
 * Tipo: unitaria   Prioridad: P0
 * Precondiciones: getSession y next/navigation mockeados.
 * Trazabilidad: DEF-WEB-001
 */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@/test/render';
import { AdminSectionGate } from './admin-section-gate';

const getSession = vi.fn();
vi.mock('@/core/auth/session', () => ({ getSession: () => getSession() }));
const redirect = vi.fn((url: string) => {
  throw new Error(`NEXT_REDIRECT:${url}`);
});
vi.mock('next/navigation', () => ({
  redirect: (url: string) => redirect(url),
}));

const COMPLIANCE = ['legal.config:manage', 'legal.consent-audit:read'];

async function renderGate(
  section: Parameters<typeof AdminSectionGate>[0]['section'],
) {
  const ui = await AdminSectionGate({
    section,
    children: <p>contenido</p>,
  });
  return render(<>{ui}</>);
}

describe('AdminSectionGate', () => {
  beforeEach(() => {
    getSession.mockReset();
    redirect.mockClear();
  });

  it('CP-WEB-AUTH-112 deja pasar a compliance en una seccion legal', async () => {
    getSession.mockResolvedValue({ permissions: COMPLIANCE });
    await renderGate('consentAudit');
    expect(screen.getByText('contenido')).toBeInTheDocument();
  });

  it('CP-WEB-AUTH-113 muestra sin acceso a compliance en una seccion ajena', async () => {
    getSession.mockResolvedValue({ permissions: COMPLIANCE });
    await renderGate('users');
    expect(screen.getByTestId('access-denied')).toBeInTheDocument();
    expect(screen.queryByText('contenido')).toBeNull();
  });

  it('CP-WEB-AUTH-114 redirige a compliance desde el dashboard a su primera seccion', async () => {
    getSession.mockResolvedValue({ permissions: COMPLIANCE });
    await expect(renderGate('dashboard')).rejects.toThrow(
      'NEXT_REDIRECT:/admin/legal/document-versions',
    );
  });

  it('CP-WEB-AUTH-115 admin:all ve el dashboard sin redirect', async () => {
    getSession.mockResolvedValue({ permissions: ['admin:all'] });
    await renderGate('dashboard');
    expect(screen.getByText('contenido')).toBeInTheDocument();
    expect(redirect).not.toHaveBeenCalled();
  });

  it('sin sesion redirige a /login', async () => {
    getSession.mockResolvedValue(null);
    await expect(renderGate('users')).rejects.toThrow('NEXT_REDIRECT:/login');
  });
});
