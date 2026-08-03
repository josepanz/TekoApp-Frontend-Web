import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Check } from 'lucide-react';

import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from './avatar';

const meta = {
  title: 'UI/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['sm', 'default', 'lg'] },
  },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

const IMG = 'https://i.pravatar.cc/80?img=12';

export const Image: Story = {
  render: (args) => (
    <Avatar {...args}>
      <AvatarImage src={IMG} alt="Ana Giménez" />
      <AvatarFallback>AG</AvatarFallback>
    </Avatar>
  ),
};

// Fallback con iniciales cuando no hay imagen (o falla la carga).
export const Fallback: Story = {
  render: (args) => (
    <Avatar {...args}>
      <AvatarImage src="" alt="" />
      <AvatarFallback>AG</AvatarFallback>
    </Avatar>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      {(['sm', 'default', 'lg'] as const).map((size) => (
        <Avatar key={size} size={size}>
          <AvatarImage src={IMG} alt="Ana Giménez" />
          <AvatarFallback>AG</AvatarFallback>
        </Avatar>
      ))}
    </div>
  ),
};

export const WithBadge: Story = {
  render: () => (
    <Avatar size="lg">
      <AvatarImage src={IMG} alt="Ana Giménez" />
      <AvatarFallback>AG</AvatarFallback>
      <AvatarBadge aria-label="Verificado">
        <Check />
      </AvatarBadge>
    </Avatar>
  ),
};

export const Group: Story = {
  render: () => (
    <AvatarGroup>
      {['AG', 'JP', 'MR'].map((initials) => (
        <Avatar key={initials}>
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
      ))}
      <AvatarGroupCount>+5</AvatarGroupCount>
    </AvatarGroup>
  ),
};
