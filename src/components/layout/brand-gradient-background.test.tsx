import { render, screen } from '@/test/render';
import { describe, expect, it } from 'vitest';
import { BrandGradientBackground } from './brand-gradient-background';

describe('BrandGradientBackground', () => {
  it('renderiza su contenido con el gradiente de marca aplicado', () => {
    // Arrange & Act
    render(
      <BrandGradientBackground className="p-6 text-white">
        <p>Hola, Ana</p>
      </BrandGradientBackground>,
    );

    // Assert
    const content = screen.getByText('Hola, Ana');
    expect(content).toBeInTheDocument();
    expect(content.parentElement).toHaveStyle({
      backgroundImage:
        'linear-gradient(135deg, var(--teko-neutral-900) 0%, var(--teko-accent-700) 55%, var(--teko-primary-600) 100%)',
    });
  });
});
