import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Label } from './label';
import { Textarea } from './textarea';

const meta = {
  title: 'UI/Textarea',
  component: Textarea,
  tags: ['autodocs'],
  args: { placeholder: 'Contanos sobre el servicio...' },
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Disabled: Story = { args: { disabled: true } };
export const Invalid: Story = { args: { 'aria-invalid': true } };

export const WithLabel: Story = {
  render: (args) => (
    <div className="grid max-w-sm gap-2">
      <Label htmlFor="desc">Descripción</Label>
      <Textarea id="desc" {...args} />
    </div>
  ),
};
