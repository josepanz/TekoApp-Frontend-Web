/**
 * Suite: `QueryProvider` - 429 muestra toast con `retryAfter`; 403 de un query se propaga al
 * error boundary (`throwOnError`) y otros errores no.
 * Casos: CP-WEB-AUTH-012..013 (ver test/qa/casos/CP-AUTH.md)
 * Tipo: unitaria   Prioridad: P1
 * Precondiciones: `sonner` mockeado; sin backend.
 */
import { useQuery } from '@tanstack/react-query';
import { render, screen, waitFor } from '@/test/render';
import { Component, type ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { ApiError } from '@/core/api-client/errors';
import { QueryProvider } from './query-provider';

const { toastError } = vi.hoisted(() => ({ toastError: vi.fn() }));
vi.mock('sonner', () => ({ toast: { error: toastError } }));

class Boundary extends Component<
  { children: ReactNode },
  { error: Error | null }
> {
  state = { error: null as Error | null };
  static getDerivedStateFromError(error: Error) {
    return { error };
  }
  render() {
    return this.state.error ? (
      <p>boundary:{(this.state.error as ApiError).status}</p>
    ) : (
      this.props.children
    );
  }
}

function Probe({
  status,
  retryAfter,
}: {
  status: number;
  retryAfter?: number;
}) {
  useQuery({
    queryKey: ['probe', status],
    retry: false,
    queryFn: () => {
      throw new ApiError(
        status,
        'x',
        null,
        undefined,
        undefined,
        [],
        retryAfter,
      );
    },
  });
  return <p>probe</p>;
}

describe('QueryProvider', () => {
  it('CP-WEB-AUTH-012: 429 -> toast con los segundos de retryAfter', async () => {
    render(
      <QueryProvider>
        <Probe status={429} retryAfter={42} />
      </QueryProvider>,
    );
    await waitFor(() => expect(toastError).toHaveBeenCalled());
    expect(toastError.mock.calls[0][0]).toContain('42');
  });

  it('CP-WEB-AUTH-013: 403 se propaga al boundary; 500 no', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const { unmount } = render(
      <QueryProvider>
        <Boundary>
          <Probe status={403} />
        </Boundary>
      </QueryProvider>,
    );
    expect(await screen.findByText('boundary:403')).toBeInTheDocument();
    unmount();

    render(
      <QueryProvider>
        <Boundary>
          <Probe status={500} />
        </Boundary>
      </QueryProvider>,
    );
    expect(await screen.findByText('probe')).toBeInTheDocument();
  });
});
