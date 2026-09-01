import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';

import { ColorPicker } from './color-picker';
import { Label } from './label';

function ColorPickerDemo({ initial }: { initial?: string }) {
  const [value, setValue] = useState<string | undefined>(initial);
  return (
    <div className="grid max-w-sm gap-2">
      <Label htmlFor="color-demo">Color</Label>
      <ColorPicker id="color-demo" value={value} onChange={setValue} />
    </div>
  );
}

const meta = {
  title: 'UI/ColorPicker',
  component: ColorPickerDemo,
  tags: ['autodocs'],
} satisfies Meta<typeof ColorPickerDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

// Paleta de referencia + selector de tono nativo (<input type="color">) — el valor sigue siendo
// un string hex simple, ver color-picker.tsx.
export const Empty: Story = { args: {} };

export const WithValue: Story = { args: { initial: '#28A745' } };
