/**
 * `PushManager.subscribe()` exige `applicationServerKey` como `Uint8Array`, pero el backend
 * entrega la clave VAPID pública en base64url (formato estándar de `web-push`/`generateVAPIDKeys()`).
 * Conversión estándar documentada en la spec de Web Push — sin librería externa.
 */
export function urlBase64ToUint8Array(
  base64String: string,
): Uint8Array<ArrayBuffer> {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  // `new Uint8Array(length)` (a diferencia de `Uint8Array.from`) queda tipado sobre un
  // `ArrayBuffer` concreto, no `ArrayBufferLike` — es lo que `PushManager.subscribe()` exige
  // para `applicationServerKey` (BufferSource).
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; i += 1) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
