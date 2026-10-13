'use client';

import { useState } from 'react';
import { SearchCombobox } from '@/components/ui/search-combobox';
import { useDebouncedValue } from '@/hooks/use-debounced-value';
import type { User } from '../api';
import { useUsersQuery } from '../hooks';

interface UserComboboxProps {
  // `referenceId` del usuario elegido (los filtros de auditoría usan referenceId, no el id
  // interno), o undefined = sin filtro.
  onChange: (userReferenceId: string | undefined) => void;
  id?: string;
  ariaLabel?: string;
  placeholder?: string;
  emptyText?: string;
  clearLabel?: string;
  className?: string;
}

// Picker de usuario con búsqueda server-side por nombre (`GET /users?name=`). El backend solo
// busca por nombre/apellido (no por email), por eso la etiqueta muestra el email como
// desambiguador pero no se puede buscar por él.
export function UserCombobox({
  onChange,
  id,
  ariaLabel,
  placeholder = 'Buscar usuario por nombre…',
  emptyText = 'Sin usuarios que coincidan',
  clearLabel,
  className,
}: UserComboboxProps) {
  const [selected, setSelected] = useState<User | null>(null);
  const [inputValue, setInputValue] = useState('');
  const name = useDebouncedValue(inputValue.trim(), 250);
  const { data, isFetching } = useUsersQuery(
    {
      page: 1,
      pageSize: 20,
      name: selected ? undefined : name || undefined,
    },
    { throwOnError: false },
  );

  return (
    <SearchCombobox<User>
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
      getKey={(user) => user.referenceId}
      getLabel={(user) => `${user.firstName} ${user.lastName} · ${user.email}`}
      onValueChange={(user) => {
        setSelected(user);
        onChange(user?.referenceId);
      }}
      onInputValueChange={(text) => {
        setInputValue(text);
        if (selected && text === '') {
          setSelected(null);
          onChange(undefined);
        }
      }}
    />
  );
}
