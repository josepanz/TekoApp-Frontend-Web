import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Input } from './input';
import { Label } from './label';

const meta = {
  title: 'UI/Input',
  component: Input,
  tags: ['autodocs'],
  args: { placeholder: 'ana@tekoapp.com.py' },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Disabled: Story = { args: { disabled: true } };

export const Invalid: Story = {
  args: { 'aria-invalid': true, defaultValue: 'no-es-un-email' },
};

export const WithLabel: Story = {
  render: (args) => (
    <div className="grid max-w-sm gap-2">
      <Label htmlFor="email">Email</Label>
      <Input id="email" type="email" {...args} />
    </div>
  ),
};
