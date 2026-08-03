import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import {
  CheckCircle2,
  TriangleAlert,
  Info as InfoIcon,
  XCircle,
} from 'lucide-react';

import { Badge } from './badge';

const meta = {
  title: 'UI/Badge',
  component: Badge,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'default',
        'secondary',
        'destructive',
        'success',
        'warning',
        'info',
        'outline',
        'ghost',
        'link',
      ],
    },
  },
  args: { children: 'Badge' },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { variant: 'default' } };
export const Secondary: Story = { args: { variant: 'secondary' } };
export const Destructive: Story = { args: { variant: 'destructive' } };
export const Success: Story = { args: { variant: 'success' } };
export const Warning: Story = { args: { variant: 'warning' } };
export const Info: Story = { args: { variant: 'info' } };
export const Outline: Story = { args: { variant: 'outline' } };
export const Ghost: Story = { args: { variant: 'ghost' } };
export const Link: Story = { args: { variant: 'link' } };

// Los 4 slots semánticos juntos — el estado NO depende solo del color (llevan ícono + texto).
// Ver .claude/rules/accessibility.md.
export const SemanticStates: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge variant="success">
        <CheckCircle2 />
        Activo
      </Badge>
      <Badge variant="warning">
        <TriangleAlert />
        Pendiente
      </Badge>
      <Badge variant="info">
        <InfoIcon />
        Nuevo
      </Badge>
      <Badge variant="destructive">
        <XCircle />
        Bloqueado
      </Badge>
    </div>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      {(
        [
          'default',
          'secondary',
          'destructive',
          'success',
          'warning',
          'info',
          'outline',
          'ghost',
          'link',
        ] as const
      ).map((variant) => (
        <Badge key={variant} variant={variant}>
          {variant}
        </Badge>
      ))}
    </div>
  ),
};
