/**
 * Dispara la descarga nativa del browser para un `Blob` ya obtenido (ver `downloadFile` en
 * `core/api-client/client.ts`). Hace falta un `<a download>` temporal con un blob URL: el fetch ya
 * consumió la respuesta (para poder pasar por el proxy BFF y manejar sesión/errores igual que
 * cualquier otra llamada), así que el browser no dispara la descarga solo con el header
 * `Content-Disposition` como haría con una navegación directa.
 */
export function triggerFileDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}
