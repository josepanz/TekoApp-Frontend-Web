import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { triggerFileDownload } from './trigger-file-download';

describe('triggerFileDownload', () => {
  const objectUrl = 'blob:mock-url';
  let createObjectURLSpy: ReturnType<typeof vi.fn>;
  let revokeObjectURLSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    createObjectURLSpy = vi.fn(() => objectUrl);
    revokeObjectURLSpy = vi.fn();
    URL.createObjectURL =
      createObjectURLSpy as unknown as typeof URL.createObjectURL;
    URL.revokeObjectURL =
      revokeObjectURLSpy as unknown as typeof URL.revokeObjectURL;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('crea un blob URL, dispara la descarga con el filename indicado y limpia el objeto temporal', () => {
    // Arrange
    const blob = new Blob(['id,monto\n1,1000'], { type: 'text/csv' });
    const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click');

    // Act
    triggerFileDownload(blob, 'pagos.csv');

    // Assert
    expect(createObjectURLSpy).toHaveBeenCalledWith(blob);
    expect(clickSpy).toHaveBeenCalledTimes(1);
    expect(revokeObjectURLSpy).toHaveBeenCalledWith(objectUrl);
    expect(document.body.querySelector('a[download]')).not.toBeInTheDocument();
  });
});
