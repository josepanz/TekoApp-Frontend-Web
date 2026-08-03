import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Label } from './label';
import { PasswordInput } from './password-input';

const meta = {
  title: 'UI/PasswordInput',
  component: PasswordInput,
  tags: ['autodocs'],
  args: { placeholder: '••••••••' },
} satisfies Meta<typeof PasswordInput>;

export default meta;
type Story = StoryObj<typeof meta>;

// El botón alterna entre password/text y expone aria-label ("Mostrar/Ocultar contraseña").
export const Default: Story = {};

export const WithValue: Story = { args: { defaultValue: 'tekoapp-2026' } };

export const WithLabel: Story = {
  render: (args) => (
    <div className="grid max-w-sm gap-2">
      <Label htmlFor="pwd">Contraseña</Label>
      <PasswordInput id="pwd" {...args} />
    </div>
  ),
};
