import { describe, expect, it, vi } from 'vitest';
import { runBulkAction } from './run-bulk-action';

describe('runBulkAction', () => {
  it('ejecuta la acción sobre todos los items y los reporta como exitosos', async () => {
    // Arrange
    const items = [1, 2, 3];
    const action = vi.fn().mockResolvedValue(undefined);

    // Act
    const result = await runBulkAction(items, action);

    // Assert
    expect(action).toHaveBeenCalledTimes(3);
    expect(result.succeeded).toEqual([1, 2, 3]);
    expect(result.failed).toEqual([]);
  });

  it('reporta como fallidos solo los items cuya acción rechaza, sin abortar el resto', async () => {
    // Arrange
    const items = [1, 2, 3, 4];
    const error = new Error('no se pudo eliminar');
    const action = vi.fn((item: number) =>
      item === 2 || item === 4
        ? Promise.reject(error)
        : Promise.resolve(undefined),
    );

    // Act
    const result = await runBulkAction(items, action);

    // Assert
    expect(action).toHaveBeenCalledTimes(4);
    expect(result.succeeded.sort()).toEqual([1, 3]);
    expect(result.failed).toEqual([
      { item: 2, error },
      { item: 4, error },
    ]);
  });

  it('nunca corre más de `concurrency` acciones en simultáneo', async () => {
    // Arrange
    const items = [1, 2, 3, 4, 5, 6];
    let inFlight = 0;
    let maxInFlight = 0;
    const action = vi.fn(async () => {
      inFlight++;
      maxInFlight = Math.max(maxInFlight, inFlight);
      await new Promise((resolve) => setTimeout(resolve, 5));
      inFlight--;
    });

    // Act
    await runBulkAction(items, action, 2);

    // Assert
    expect(maxInFlight).toBeLessThanOrEqual(2);
  });

  it('devuelve listas vacías cuando no hay items', async () => {
    // Arrange
    const action = vi.fn();

    // Act
    const result = await runBulkAction([], action);

    // Assert
    expect(action).not.toHaveBeenCalled();
    expect(result).toEqual({ succeeded: [], failed: [] });
  });
});
