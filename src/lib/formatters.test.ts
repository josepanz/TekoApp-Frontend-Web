import { describe, expect, it } from 'vitest';
import { formatCurrency, formatNumber, formatPercent } from './formatters';

describe('formatNumber', () => {
  it('agrupa los miles con el separador de es-PY', () => {
    // Arrange & Act
    const result = formatNumber(12500);

    // Assert
    expect(result).toBe('12.500');
  });
});

describe('formatCurrency', () => {
  it('formatea un monto en guaraníes sin decimales', () => {
    // Arrange & Act
    const result = formatCurrency(18500000);

    // Assert
    expect(result).toContain('18.500.000');
  });
});

describe('formatPercent', () => {
  it('antepone un signo + a los valores positivos', () => {
    // Arrange & Act
    const result = formatPercent(5.4);

    // Assert
    expect(result).toBe('+5.4%');
  });

  it('no antepone signo a los valores negativos', () => {
    // Arrange & Act
    const result = formatPercent(-2.1);

    // Assert
    expect(result).toBe('-2.1%');
  });
});
