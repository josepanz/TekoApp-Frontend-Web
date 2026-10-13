'use client';

import { useState } from 'react';
import { SearchCombobox } from '@/components/ui/search-combobox';
import { useDebouncedValue } from '@/hooks/use-debounced-value';
import type { Country } from '../api';
import { useCountriesQuery } from '../hooks';

interface CountryComboboxProps {
  // `id` interno del país (el filtro del backend es `countryId`), o undefined = sin filtro.
  onChange: (countryId: number | undefined) => void;
  id?: string;
  ariaLabel?: string;
  placeholder?: string;
  emptyText?: string;
  clearLabel?: string;
  className?: string;
}

// Picker de país con búsqueda server-side (`GET /countries?search=`) — reemplaza el input de id
// numérico plano.
export function CountryCombobox({
  onChange,
  id,
  ariaLabel,
  placeholder = 'Buscar país…',
  emptyText = 'Sin países que coincidan',
  clearLabel,
  className,
}: CountryComboboxProps) {
  const [selected, setSelected] = useState<Country | null>(null);
  const [inputValue, setInputValue] = useState('');
  const search = useDebouncedValue(inputValue.trim(), 250);
  const { data, isFetching } = useCountriesQuery({
    search: selected ? undefined : search || undefined,
  });

  return (
    <SearchCombobox<Country>
      id={id}
      ariaLabel={ariaLabel}
      placeholder={placeholder}
      emptyText={emptyText}
      clearLabel={clearLabel}
      className={className}
      items={data?.data ?? []}
      isLoading={isFetching && !data}
      value={selected}
      inputValue={inputValue}
      getKey={(country) => String(country.id)}
      getLabel={(country) => `${country.commonName} (${country.iso2})`}
      onValueChange={(country) => {
        setSelected(country);
        onChange(country?.id);
      }}
      onInputValueChange={(text) => {
        setInputValue(text);
        // Editar el texto invalida la selección previa: el filtro vuelve a "sin país".
        if (selected && text === '') {
          setSelected(null);
          onChange(undefined);
        }
      }}
    />
  );
}
