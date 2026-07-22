import { NextResponse, type NextRequest } from 'next/server';

// El access token vive en cookie httpOnly — el browser no lo puede leer para el handshake de
// socket.io contra LocationsGateway (que espera el JWT en handshake.auth.token). Esta ruta
// devuelve el valor vigente SOLO para usarlo en memoria al abrir el socket, nunca persistirlo.
// Ver documentation/architecture.md → "Realtime — el ticket de socket".
export function GET(request: NextRequest): Response {
  const accessToken = request.cookies.get('accessToken')?.value;

  if (!accessToken) {
    return NextResponse.json({ message: 'No autenticado' }, { status: 401 });
  }

  return NextResponse.json({ token: accessToken });
}
