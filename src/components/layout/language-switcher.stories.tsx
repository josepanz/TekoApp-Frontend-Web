import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { LanguageSwitcher } from './language-switcher';

// Botón solo-ícono con aria-label "Cambiar idioma" que abre un menú Español/English. Persiste la
// elección en la cookie NEXT_LOCALE vía Server Action (no hay segmento [locale] en la URL — ver
// src/i18n/request.ts). En Storybook la Server Action no corre: el menú se muestra, pero cambiar
// de idioma no re-renderiza el preview.
const meta = {
  title: 'Layout/LanguageSwitcher',
  component: LanguageSwitcher,
  tags: ['autodocs'],
} satisfies Meta<typeof LanguageSwitcher>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
