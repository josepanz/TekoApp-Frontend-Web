import { redirect } from 'next/navigation';

// `/pro` no tenía page.tsx propio (solo sus subrutas) — Next.js devolvía 404 en la ruta índice
// del área profesional aunque el layout+gate funcionaran bien. La bandeja de solicitudes es el
// destino más natural al entrar al modo profesional.
export default function ProIndexPage() {
  redirect('/pro/solicitudes');
}
