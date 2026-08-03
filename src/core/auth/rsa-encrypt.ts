import 'server-only';
import { publicEncrypt, constants } from 'node:crypto';
import { env } from '@/core/config/env';

// Espeja exactamente CryptoHelper.encrypt() del backend (RSA-OAEP, SHA-256, base64) —
// ver src/common/helpers/crypto-helpers.ts en TekoApp-Backend. Usado SOLO en
// app/api/auth/login/route.ts, nunca en código que corra en el browser.
function formatPemKey(key: string): string {
  return key.replace(/\\n/g, '\n');
}

export function encryptPassword(plainPassword: string): string {
  const publicKey = formatPemKey(env.BACKEND_JWT_PUBLIC_KEY);

  const encrypted = publicEncrypt(
    {
      key: publicKey,
      padding: constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: 'sha256',
    },
    Buffer.from(plainPassword, 'utf-8'),
  );

  return encrypted.toString('base64');
}
