import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs';

const meta = {
  title: 'UI/Tabs',
  component: Tabs,
  tags: ['autodocs'],
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Tabs defaultValue="detail" className="w-96">
      <TabsList>
        <TabsTrigger value="detail">Perfil</TabsTrigger>
        <TabsTrigger value="documents">Documentos</TabsTrigger>
      </TabsList>
      <TabsContent value="detail">Contenido del perfil.</TabsContent>
      <TabsContent value="documents">Contenido de documentos.</TabsContent>
    </Tabs>
  ),
};

export const Line: Story = {
  render: () => (
    <Tabs defaultValue="detail" className="w-96">
      <TabsList variant="line">
        <TabsTrigger value="detail">Perfil</TabsTrigger>
        <TabsTrigger value="documents">Documentos</TabsTrigger>
      </TabsList>
      <TabsContent value="detail">Contenido del perfil.</TabsContent>
      <TabsContent value="documents">Contenido de documentos.</TabsContent>
    </Tabs>
  ),
};
