import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Button } from './button';
import { Input } from './input';
import { Label } from './label';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './sheet';

const meta = {
  title: 'UI/Sheet',
  component: Sheet,
  tags: ['autodocs'],
} satisfies Meta<typeof Sheet>;

export default meta;
type Story = StoryObj<typeof meta>;

const Body = () => (
  <>
    <SheetHeader>
      <SheetTitle>Filtros</SheetTitle>
      <SheetDescription>
        Ajustá cómo se listan los profesionales.
      </SheetDescription>
    </SheetHeader>
    <div className="grid gap-2 px-4">
      <Label htmlFor="zone">Zona</Label>
      <Input id="zone" placeholder="Asunción, Central..." />
    </div>
    <SheetFooter>
      <Button>Aplicar</Button>
      <SheetClose render={<Button variant="outline">Cancelar</Button>} />
    </SheetFooter>
  </>
);

export const Right: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger render={<Button variant="outline">Abrir filtros</Button>} />
      <SheetContent side="right">
        <Body />
      </SheetContent>
    </Sheet>
  ),
};

export const Left: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger
        render={<Button variant="outline">Abrir (izquierda)</Button>}
      />
      <SheetContent side="left">
        <Body />
      </SheetContent>
    </Sheet>
  ),
};
