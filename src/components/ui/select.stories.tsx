import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from './select';

const meta = {
  title: 'UI/Select',
  component: Select,
  tags: ['autodocs'],
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-56">
        <SelectValue placeholder="Elegí una categoría" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="plomeria">Plomería</SelectItem>
        <SelectItem value="electricidad">Electricidad</SelectItem>
        <SelectItem value="pintura">Pintura</SelectItem>
        <SelectItem value="jardineria">Jardinería</SelectItem>
      </SelectContent>
    </Select>
  ),
};

export const Grouped: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-56">
        <SelectValue placeholder="Elegí un servicio" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Hogar</SelectLabel>
          <SelectItem value="plomeria">Plomería</SelectItem>
          <SelectItem value="electricidad">Electricidad</SelectItem>
        </SelectGroup>
        <SelectSeparator />
        <SelectGroup>
          <SelectLabel>Exterior</SelectLabel>
          <SelectItem value="jardineria">Jardinería</SelectItem>
          <SelectItem value="pileta">Mantenimiento de pileta</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  ),
};

export const Disabled: Story = {
  render: () => (
    <Select disabled>
      <SelectTrigger className="w-56">
        <SelectValue placeholder="No disponible" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="a">Opción A</SelectItem>
      </SelectContent>
    </Select>
  ),
};
