import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Badge } from './badge';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './table';

const meta = {
  title: 'UI/Table',
  component: Table,
  tags: ['autodocs'],
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof meta>;

const rows = [
  { name: 'Ana Giménez', service: 'Plomería', status: 'Activo' },
  { name: 'Juan Pérez', service: 'Electricidad', status: 'Pendiente' },
  { name: 'María Rodríguez', service: 'Pintura', status: 'Bloqueado' },
] as const;

const statusVariant = {
  Activo: 'success',
  Pendiente: 'warning',
  Bloqueado: 'destructive',
} as const;

export const Default: Story = {
  render: () => (
    <Table>
      <TableCaption>Profesionales registrados este mes.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Nombre</TableHead>
          <TableHead>Servicio</TableHead>
          <TableHead>Estado</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row) => (
          <TableRow key={row.name}>
            <TableCell className="font-medium">{row.name}</TableCell>
            <TableCell>{row.service}</TableCell>
            <TableCell>
              <Badge variant={statusVariant[row.status]}>{row.status}</Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
};
