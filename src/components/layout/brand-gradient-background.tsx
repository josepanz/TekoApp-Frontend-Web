import type { ReactNode } from 'react';

interface BrandGradientBackgroundProps {
  children: ReactNode;
  className?: string;
}

/**
 * Gradiente diagonal navy→teal→verde inspirado en el banner de `brand/manual-de-marca.png` —
 * única referencia real de gradiente de marca hoy (el logo y el banner plano no tienen gradiente).
 * Usa los shades 700/600 (no los 500 crudos de `tokens.json`) para que texto blanco encima pase
 * contraste AA en TODA la superficie del gradiente — mismo criterio que `--primary` usa 600 en vez
 * de 500 (ver `tokens.json`, primary.600: "L .52 da ~5:1 con texto blanco").
 *
 * Contenedor puro (sin padding/rounding propios) — el caller decide si es un hero acotado (rounded
 * + padding) o el fondo de una página completa.
 */
export function BrandGradientBackground({
  children,
  className,
}: BrandGradientBackgroundProps) {
  return (
    <div
      className={className}
      style={{
        backgroundImage:
          'linear-gradient(135deg, var(--teko-neutral-900) 0%, var(--teko-accent-700) 55%, var(--teko-primary-600) 100%)',
      }}
    >
      {children}
    </div>
  );
}
