import { NextRequest } from 'next/server';
import { describe, expect, it } from 'vitest';
import { proxy } from './proxy';

function makeRequest(pathname: string, { hasSession = false } = {}) {
  const request = new NextRequest(new URL(pathname, 'http://localhost:3000'));
  if (hasSession) {
    request.cookies.set('accessToken', 'fake-token');
  }
  return request;
}

describe('proxy', () => {
  it('deja pasar /register sin sesión (bug real: faltaba en PUBLIC_PATHS y redirigía a /login)', () => {
    // Arrange
    const request = makeRequest('/register');

    // Act
    const response = proxy(request);

    // Assert
    expect(response.headers.get('location')).toBeNull();
  });

  it('deja pasar /login sin sesión', () => {
    // Arrange
    const request = makeRequest('/login');

    // Act
    const response = proxy(request);

    // Assert
    expect(response.headers.get('location')).toBeNull();
  });

  it('redirige a /login?from=<ruta> cuando una ruta protegida no tiene sesión', () => {
    // Arrange
    const request = makeRequest('/perfil');

    // Act
    const response = proxy(request);

    // Assert
    const location = response.headers.get('location');
    expect(location).not.toBeNull();
    expect(new URL(location!).pathname).toBe('/login');
    expect(new URL(location!).searchParams.get('from')).toBe('/perfil');
  });

  it('redirige al home si ya hay sesión y se visita una ruta pública (/register o /login)', () => {
    // Arrange
    const request = makeRequest('/register', { hasSession: true });

    // Act
    const response = proxy(request);

    // Assert
    const location = response.headers.get('location');
    expect(location).not.toBeNull();
    expect(new URL(location!).pathname).toBe('/');
  });
});
