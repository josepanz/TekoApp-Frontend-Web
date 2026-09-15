import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useDebouncedValue } from './use-debounced-value';

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe('useDebouncedValue', () => {
  it('mantiene el valor inicial hasta que pasa el delay', () => {
    // Arrange & Act
    const { result } = renderHook(() => useDebouncedValue('a', 300));

    // Assert
    expect(result.current).toBe('a');
  });

  it('actualiza al nuevo valor recién después del delay, no en cada cambio intermedio', () => {
    // Arrange
    const { result, rerender } = renderHook(
      ({ value }) => useDebouncedValue(value, 300),
      { initialProps: { value: 'a' } },
    );

    // Act: dos cambios rápidos antes de que venza el delay
    rerender({ value: 'ab' });
    act(() => {
      vi.advanceTimersByTime(100);
    });
    rerender({ value: 'abc' });

    // Assert: todavía no pasó el delay completo desde el último cambio
    expect(result.current).toBe('a');

    act(() => {
      vi.advanceTimersByTime(300);
    });

    // Assert: se asienta en el último valor, no en uno intermedio
    expect(result.current).toBe('abc');
  });
});
