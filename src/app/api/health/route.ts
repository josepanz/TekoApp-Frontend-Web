import { NextResponse } from 'next/server';

// Usado por los probes de Kubernetes (startupProbe/readinessProbe/livenessProbe) — ver ci/*/1_deployment.yml.
// Solo confirma que el servidor de Next.js responde; no valida conectividad con el backend.
export function GET() {
  return NextResponse.json({ status: 'ok' });
}
