import { describe, expect, it } from 'vitest';
import { urlBase64ToUint8Array } from './web-push';

describe('urlBase64ToUint8Array', () => {
  it('convierte una clave VAPID base64url a Uint8Array con los bytes correctos', () => {
    // Arrange
    // "hello" en base64url estándar (sin padding, con - y _ en vez de + y /)
    const base64Url = 'aGVsbG8';

    // Act
    const result = urlBase64ToUint8Array(base64Url);

    // Assert
    expect(Array.from(result)).toEqual([104, 101, 108, 108, 111]); // "hello"
  });

  it('maneja correctamente los caracteres - y _ propios de base64url', () => {
    // Arrange
    const rawBytes = Uint8Array.from([251, 255, 191]);
    const standardBase64 = btoa(String.fromCharCode(...rawBytes));
    const base64Url = standardBase64
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    // Act
    const result = urlBase64ToUint8Array(base64Url);

    // Assert
    expect(Array.from(result)).toEqual(Array.from(rawBytes));
  });
});
