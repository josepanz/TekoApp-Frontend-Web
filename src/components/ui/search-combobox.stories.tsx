import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';

import { SearchCombobox } from './search-combobox';

interface Fruit {
  id: string;
  name: string;
}

const FRUITS: Fruit[] = [
  { id: '1', name: 'Manzana' },
  { id: '2', name: 'Banana' },
  { id: '3', name: 'Mandarina' },
];

const meta = {
  title: 'UI/SearchCombobox',
  component: SearchCombobox,
  tags: ['autodocs'],
} satisfies Meta<typeof SearchCombobox>;

export default meta;
type Story = StoryObj<typeof meta>;

// Búsqueda "server-side" simulada: el caller filtra y pasa `items`.
export const Default: Story = {
  args: {} as never,
  render: () => {
    function Wrapper() {
      const [value, setValue] = useState<Fruit | null>(null);
      const [text, setText] = useState('');
      const items = FRUITS.filter((fruit) =>
        fruit.name.toLowerCase().includes(text.toLowerCase()),
      );
      return (
        <SearchCombobox<Fruit>
          className="w-64"
          items={items}
          value={value}
          onValueChange={setValue}
          inputValue={text}
          onInputValueChange={setText}
          getKey={(fruit) => fruit.id}
          getLabel={(fruit) => fruit.name}
          placeholder="Buscar fruta…"
          emptyText="Sin resultados"
        />
      );
    }
    return <Wrapper />;
  },
};
