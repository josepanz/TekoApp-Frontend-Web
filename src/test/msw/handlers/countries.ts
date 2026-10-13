import { http, HttpResponse } from 'msw';
import type { Country } from '@/features/countries/api';

export function buildCountry(overrides: Partial<Country> = {}): Country {
  return {
    id: 1,
    commonName: 'Paraguay',
    officialName: 'República del Paraguay',
    iso2: 'PY',
    iso3: 'PRY',
    numericCode: '600',
    phonePrefixCode: '+595',
    isActive: true,
    ...overrides,
  };
}

export const fakeCountries: Country[] = [
  buildCountry(),
  buildCountry({
    id: 2,
    commonName: 'Argentina',
    officialName: 'República Argentina',
    iso2: 'AR',
    iso3: 'ARG',
    numericCode: '032',
    phonePrefixCode: '+54',
  }),
];

export const countriesHandlers = [
  http.get('/api/backend/countries', ({ request }) => {
    const search = new URL(request.url).searchParams
      .get('search')
      ?.toLowerCase();
    const data = search
      ? fakeCountries.filter((country) =>
          country.commonName.toLowerCase().includes(search),
        )
      : fakeCountries;
    return HttpResponse.json({
      data,
      pagination: { total: data.length, page: 1, pageSize: 20, totalPages: 1 },
    });
  }),
];
