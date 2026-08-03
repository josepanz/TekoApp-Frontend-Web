import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import {
  CheckCircle2,
  Info as InfoIcon,
  TriangleAlert,
  XCircle,
} from 'lucide-react';

import { Alert, AlertDescription, AlertTitle } from './alert';

const meta = {
  title: 'UI/Alert',
  component: Alert,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'destructive', 'success', 'warning', 'info'],
    },
  },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Alert {...args} className="max-w-md">
      <InfoIcon />
      <AlertTitle>Recordatorio</AlertTitle>
      <AlertDescription>
        Tenés cambios sin guardar en este formulario.
      </AlertDescription>
    </Alert>
  ),
};

export const Success: Story = {
  args: { variant: 'success' },
  render: (args) => (
    <Alert {...args} className="max-w-md">
      <CheckCircle2 />
      <AlertTitle>Listo</AlertTitle>
      <AlertDescription>El servicio se publicó correctamente.</AlertDescription>
    </Alert>
  ),
};

export const Warning: Story = {
  args: { variant: 'warning' },
  render: (args) => (
    <Alert {...args} className="max-w-md">
      <TriangleAlert />
      <AlertTitle>Atención</AlertTitle>
      <AlertDescription>
        Tu perfil está incompleto: agregá al menos una categoría.
      </AlertDescription>
    </Alert>
  ),
};

export const Info: Story = {
  args: { variant: 'info' },
  render: (args) => (
    <Alert {...args} className="max-w-md">
      <InfoIcon />
      <AlertTitle>Novedad</AlertTitle>
      <AlertDescription>Ya podés recibir pagos con tarjeta.</AlertDescription>
    </Alert>
  ),
};

export const Destructive: Story = {
  args: { variant: 'destructive' },
  render: (args) => (
    <Alert {...args} className="max-w-md">
      <XCircle />
      <AlertTitle>No se pudo guardar</AlertTitle>
      <AlertDescription>
        Revisá tu conexión e intentá de nuevo.
      </AlertDescription>
    </Alert>
  ),
};
