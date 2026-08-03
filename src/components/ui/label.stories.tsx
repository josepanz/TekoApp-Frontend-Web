import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Input } from './input';
import { Label } from './label';

const meta = {
  title: 'UI/Label',
  component: Label,
  tags: ['autodocs'],
  args: { children: 'Nombre completo' },
} satisfies Meta<typeof Label>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const AssociatedWithInput: Story = {
  render: () => (
    <div className="grid max-w-sm gap-2">
      <Label htmlFor="fullname">Nombre completo</Label>
      <Input id="fullname" placeholder="Ana Giménez" />
    </div>
  ),
};
