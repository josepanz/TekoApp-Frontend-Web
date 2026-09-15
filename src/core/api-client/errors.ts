export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly body?: unknown,
    // Identificador máquina-legible opcional (ej. `DELETION_BLOCKED`) y su detalle estructurado
    // — ambos vienen del `error.{errorCode,details}` del envelope real del backend
    // (`HttpExceptionFilter`), ver `parseErrorResponse` en `client.ts`. Antes solo estaban
    // enterrados en `body`, sin tipar — cualquier pantalla que necesite reaccionar a un error
    // puntual (no solo mostrar `message`) debería leerlos de acá, no cavar en `body` a mano.
    public readonly errorCode?: string,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}
