import { describe, expect, it } from 'vitest';
import { cn } from './utils';

describe('cn', () => {
  it('combina clases y resuelve conflictos de Tailwind quedándose con la última', () => {
    // Arrange
    const base = 'px-2 py-1';
    const override = 'px-4';

    // Act
    const result = cn(base, override);

    // Assert
    expect(result).toBe('py-1 px-4');
  });

  it('ignora valores falsy (undefined, false, null)', () => {
    // Arrange & Act
    const result = cn('text-sm', undefined, false, null, 'font-bold');

    // Assert
    expect(result).toBe('text-sm font-bold');
  });
});
