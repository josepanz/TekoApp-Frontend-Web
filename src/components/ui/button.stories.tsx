import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Plus } from 'lucide-react';

import { Button } from './button';

const meta = {
  title: 'UI/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'default',
        'outline',
        'secondary',
        'ghost',
        'destructive',
        'link',
      ],
    },
    size: {
      control: 'select',
      options: [
        'default',
        'xs',
        'sm',
        'lg',
        'icon',
        'icon-xs',
        'icon-sm',
        'icon-lg',
      ],
    },
    disabled: { control: 'boolean' },
  },
  args: { children: 'Botón' },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { variant: 'default' } };
export const Outline: Story = { args: { variant: 'outline' } };
export const Secondary: Story = { args: { variant: 'secondary' } };
export const Ghost: Story = { args: { variant: 'ghost' } };
export const Destructive: Story = { args: { variant: 'destructive' } };
export const Link: Story = { args: { variant: 'link' } };
export const Disabled: Story = { args: { disabled: true } };

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      {(
        [
          'default',
          'outline',
          'secondary',
          'ghost',
          'destructive',
          'link',
        ] as const
      ).map((variant) => (
        <Button key={variant} variant={variant}>
          {variant}
        </Button>
      ))}
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Button size="xs">xs</Button>
      <Button size="sm">sm</Button>
      <Button size="default">default</Button>
      <Button size="lg">lg</Button>
    </div>
  ),
};

export const IconOnly: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Button size="icon-xs" aria-label="Agregar">
        <Plus />
      </Button>
      <Button size="icon-sm" aria-label="Agregar">
        <Plus />
      </Button>
      <Button size="icon" aria-label="Agregar">
        <Plus />
      </Button>
      <Button size="icon-lg" aria-label="Agregar">
        <Plus />
      </Button>
    </div>
  ),
};
