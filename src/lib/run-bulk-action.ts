export interface BulkActionFailure<T> {
  item: T;
  error: unknown;
}

export interface BulkActionResult<T> {
  succeeded: T[];
  failed: BulkActionFailure<T>[];
}

const DEFAULT_CONCURRENCY = 5;

// Corre `action` para cada item con un límite de concurrencia (nunca todo el array a la vez,
// para no saturar el backend cuando alguien selecciona una página grande) y nunca aborta el resto
// por un fallo individual — equivalente a `Promise.allSettled` pero acotado en paralelismo.
export async function runBulkAction<T>(
  items: T[],
  action: (item: T) => Promise<void>,
  concurrency = DEFAULT_CONCURRENCY,
): Promise<BulkActionResult<T>> {
  const succeeded: T[] = [];
  const failed: BulkActionFailure<T>[] = [];
  let nextIndex = 0;

  async function worker() {
    while (nextIndex < items.length) {
      const item = items[nextIndex++];
      try {
        await action(item);
        succeeded.push(item);
      } catch (error) {
        failed.push({ item, error });
      }
    }
  }

  const workerCount = Math.max(1, Math.min(concurrency, items.length));
  await Promise.all(Array.from({ length: workerCount }, () => worker()));

  return { succeeded, failed };
}
