import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';

import { IconPicker } from './icon-picker';
import { Label } from './label';

function IconPickerDemo({ initial }: { initial?: string }) {
  const [value, setValue] = useState<string | undefined>(initial);
  return (
    <div className="grid max-w-sm gap-2">
      <Label htmlFor="icon-demo">Ícono</Label>
      <IconPicker id="icon-demo" value={value} onChange={setValue} />
    </div>
  );
}

const meta = {
  title: 'UI/IconPicker',
  component: IconPickerDemo,
  tags: ['autodocs'],
} satisfies Meta<typeof IconPickerDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

// Catálogo curado de lucide-react (no el registro completo) + búsqueda por nombre — ver
// icon-picker.tsx para la lista.
export const Empty: Story = { args: {} };

export const WithValue: Story = { args: { initial: 'wrench' } };
