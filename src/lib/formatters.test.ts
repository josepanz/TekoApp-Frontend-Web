import { describe, expect, it } from 'vitest';
import {
  formatCurrency,
  formatDate,
  formatNumber,
  formatPercent,
} from './formatters';

describe('formatNumber', () => {
  it('agrupa los miles con el separador de es-PY', () => {
    // Arrange & Act
    const result = formatNumber(12500);

    // Assert
    expect(result).toBe('12.500');
  });

  it('agrupa los miles con el separador de en-US cuando el locale es inglés', () => {
    // Arrange & Act
    const result = formatNumber(12500, 'en');

    // Assert
    expect(result).toBe('12,500');
  });
});

describe('formatCurrency', () => {
  it('formatea un monto en guaraníes sin decimales', () => {
    // Arrange & Act
    const result = formatCurrency(18500000);

    // Assert
    expect(result).toContain('18.500.000');
  });

  it('usa el código de moneda recibido en vez del guaraní por defecto', () => {
    // Arrange & Act
    const result = formatCurrency(1500, 'USD');

    // Assert
    expect(result).toContain('1.500');
    expect(result).not.toContain('Gs');
  });
});

describe('formatDate', () => {
  it('usa el orden día/mes de es-PY por defecto', () => {
    // Arrange & Act
    const result = formatDate('2026-05-01T10:00:00Z');

    // Assert
    expect(result).toBe('1/5/2026');
  });

  it('usa el orden mes/día de en-US cuando el locale es inglés', () => {
    // Arrange & Act
    const result = formatDate('2026-05-01T10:00:00Z', 'en');

    // Assert
    expect(result).toBe('5/1/2026');
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
