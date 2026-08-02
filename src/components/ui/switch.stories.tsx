import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Label } from './label';
import { Switch } from './switch';

const meta = {
  title: 'UI/Switch',
  component: Switch,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['sm', 'default'] },
    disabled: { control: 'boolean' },
    defaultChecked: { control: 'boolean' },
  },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Checked: Story = { args: { defaultChecked: true } };
export const Small: Story = { args: { size: 'sm', defaultChecked: true } };
export const Disabled: Story = { args: { disabled: true } };

export const WithLabel: Story = {
  render: (args) => (
    <Label>
      <Switch {...args} />
      Recibir notificaciones
    </Label>
  ),
};
