import { privateDecrypt, constants } from 'node:crypto';
import { beforeAll, describe, expect, it, vi } from 'vitest';

const TEST_PUBLIC_KEY =
  '-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAr8lAmtIh+gl5mmcc48urP3oUIXVbft5roDcBuFF6wi5vkKOmQ5uZQxIj10WmSa/nZ2KMX/QFxDMWrfChJWaIZr8gFJ5fe5zVn4ww2YrnBJip11ln9AwBeqIOHLDGwlON1owU5JwXq4hg/m9Qvw2xOEz57OFmZxVRW/PfZXOzfO2J4gA7A6a43AqVmYfB8q3RMc2nKWycecKBGrqh+8ERiyVPRHomLmfjIgs3OAKeyVFhhVng4DCSxTpU05kcZ5INtxnHssxZnrT2xCRwWUg0g5OQ3+sc1XtTkgr2z/BVycSv1+N9y0Kuq/xhRiI8Fa7+19vkvWSu1ZzynhXKchhIeQIDAQAB\n-----END PUBLIC KEY-----';
const TEST_PRIVATE_KEY =
  '-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCvyUCa0iH6CXmaZxzjy6s/ehQhdVt+3mugNwG4UXrCLm+Qo6ZDm5lDEiPXRaZJr+dnYoxf9AXEMxat8KElZohmvyAUnl97nNWfjDDZiucEmKnXWWf0DAF6og4csMbCU43WjBTknBeriGD+b1C/DbE4TPns4WZnFVFb899lc7N87YniADsDprjcCpWZh8HyrdExzacpbJx5woEauqH7wRGLJU9EeiYuZ+MiCzc4Ap7JUWGFWeDgMJLFOlTTmRxnkg23GceyzFmetPbEJHBZSDSDk5Df6xzVe1OSCvbP8FXJxK/X433LQq6r/GFGIjwVrv7X2+S9ZK7VnPKeFcpyGEh5AgMBAAECggEAMGvS6HKumkXm4cG6gwMUumkBx4+gsutIoTrVtfR3yKpq3+A8Sc5AIuoJxmAwpIaYSvGp8jpxJjDec+5fLUK3mvnVt+hCK/YxIABJanspFKqKyj+d82slMycVlRCax2eln+45SRm4KW9pLFz0VJRMd1I42+fgwc9s+FPOew8qZ2RAVF4aUIZ3f8dZlTDUl9SEk4Ij6I3I0Lu94IqSnM67GkN9ys/PKO1x3wb2I69krkp/yc5CFxGcqgtfRo799aB0+I9YAoy5rc2nmPaFMVUaqdjjx9sX5qHPIv+rCIYk0tP+fmR0F1UvPWqjFWv2vuh16/JT2S0yfWDYnWlXgicXiwKBgQDa2v2QsaF1sp2Az+QY56+V2tESXRAkOuJ0X7uF0AK2IJvd8n1aJxg9lCR8OqHUbo/qhGYeIE1apa6JJ/+demht/ez/pPxlIarKIvOLp0gvb0EcsrsH6CUUz+yZqR6Fj5POly5MDSQbKUPN7XCsbrVBjGbVOwRadi4xZfS8l5VlTwKBgQDNnvPEB0pfV8HSJrWjO81SxfaG9kxiJPy6nLbJFG62KNmMr131IrFggEEscRCp0/4QzhW0QIiSZXis3QXvxNj7qirH7Ya4yV7e9ZulCEzzeXsCXyJ1F2bE5dQrTZ2sKnBHKHWSdYuDNyOFQcbSrg5TS0w4/P2OudhU1M6WIbgTtwKBgEy/9aJzmMLU08VjooNVZM8xwJYnCs0Z1WaoV/PyYbELOH4aVvlxsl+N/0mNqkj8SP4eVk2EWHxMlCvHWi4Yylygayev7U9uAh4HKc+052yzIGt3Bn4cXDyzOi8dDvYZxuTxQawsA5h+3SdveE8QOAJ3wWxP2RP8U/DA55Xntt2jAoGBAI6+76nCCe6gpMy41NZKeOMizV+qcyKbXNxMWVTFG4rYVxck04yPliZRQ22P3KqZokKWX1jwiB9h1GHlWu62cJBd9S8whZuZKISOa4wpdAp+5leiJfC120GL8DxTuMdB+wpbWyve8Iiaac1j+Zxe+1D18CeL8pb4C+fwiK6PIBSHAoGBAL03v08kOHE57kSwpjwnDJd59VlgRjaEpIce/fYOjwvPIUHG0nwM8I4S+CXHOEdFncqWX6suUSFYwXZ+gJu/gdBP4YQsImcz0+DJcyd3PogNSxAJNUhe7NH1506FxEERpyuPziyqwDpterpGJqrEiVXeifV/H21ulC3n/ToJ7IKg\n-----END PRIVATE KEY-----';

beforeAll(() => {
  vi.stubEnv('BACKEND_JWT_PUBLIC_KEY', TEST_PUBLIC_KEY);
  vi.stubEnv('BACKEND_API_URL', 'http://localhost:3000/tekoapp-backend/api');
  vi.stubEnv('BACKEND_CLIENT_ID', 'test-client');
  vi.stubEnv('BACKEND_CLIENT_SECRET', 'test-secret');
  vi.stubEnv('BACKEND_SOCKET_URL', 'http://localhost:3000');
});

describe('encryptPassword', () => {
  it('cifra un valor de forma que el backend pueda descifrarlo con RSA-OAEP-SHA256', async () => {
    // Arrange
    const { encryptPassword } = await import('./rsa-encrypt');
    const plainPassword = 'Sup3rSecreto!2026';

    // Act
    const encrypted = encryptPassword(plainPassword);
    const decrypted = privateDecrypt(
      {
        key: TEST_PRIVATE_KEY,
        padding: constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: 'sha256',
      },
      Buffer.from(encrypted, 'base64'),
    ).toString('utf-8');

    // Assert
    expect(decrypted).toBe(plainPassword);
  });

  it('produce un resultado distinto cada vez (OAEP usa padding aleatorio)', async () => {
    // Arrange
    const { encryptPassword } = await import('./rsa-encrypt');

    // Act
    const first = encryptPassword('misma-contraseña');
    const second = encryptPassword('misma-contraseña');

    // Assert
    expect(first).not.toBe(second);
  });
});
