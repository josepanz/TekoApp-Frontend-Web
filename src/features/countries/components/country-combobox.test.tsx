import { QueryClientProvider } from '@tanstack/react-query';
import userEvent from '@testing-library/user-event';
import { HttpResponse, http } from 'msw';
import { describe, expect, it, vi } from 'vitest';
import { server } from '@/test/msw/server';
import { createTestQueryClient } from '@/test/query-client';
import { render, screen, waitFor } from '@/test/render';
import { CountryCombobox } from './country-combobox';

function renderCombobox(onChange = vi.fn()) {
  render(
    <QueryClientProvider client={createTestQueryClient()}>
      <CountryCombobox ariaLabel="País" onChange={onChange} />
    </QueryClientProvider>,
  );
  return onChange;
}

describe('CountryCombobox', () => {
  it('busca en el servidor mientras se tipea y devuelve el id elegido', async () => {
    // Arrange
    const searches: (string | null)[] = [];
    server.use(
      http.get('/api/backend/countries', ({ request }) => {
        const search = new URL(request.url).searchParams.get('search');
        searches.push(search);
        return HttpResponse.json({
          data: [
            {
              id: 2,
              commonName: 'Argentina',
              officialName: 'República Argentina',
              iso2: 'AR',
              iso3: 'ARG',
              numericCode: '032',
              phonePrefixCode: '+54',
              isActive: true,
            },
          ],
          pagination: { total: 1, page: 1, pageSize: 20, totalPages: 1 },
        });
      }),
    );
    const user = userEvent.setup();
    const onChange = renderCombobox();

    // Act
    await user.type(screen.getByRole('combobox', { name: 'País' }), 'arg');
    await waitFor(() => expect(searches).toContain('arg'));
    await user.click(await screen.findByRole('option', { name: /Argentina/ }));

    // Assert
    expect(onChange).toHaveBeenLastCalledWith(2);
  });

  it('muestra el mensaje vacío cuando no hay coincidencias', async () => {
    // Arrange
    server.use(
      http.get('/api/backend/countries', () =>
        HttpResponse.json({
          data: [],
          pagination: { total: 0, page: 1, pageSize: 20, totalPages: 0 },
        }),
      ),
    );
    const user = userEvent.setup();
    renderCombobox();

    // Act
    await user.type(screen.getByRole('combobox', { name: 'País' }), 'zzz');

    // Assert
    expect(
      await screen.findByText('Sin países que coincidan'),
    ).toBeInTheDocument();
  });
});
