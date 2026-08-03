import type { Preview } from '@storybook/nextjs-vite';
import { withThemeByClassName } from '@storybook/addon-themes';

// globals.css importa Tailwind v4 + tw-animate-css + theme.generated.css (los tokens de marca).
// Cargarlo acá hace que Storybook renderice con los MISMOS colores/dark mode que la app real.
import '../src/app/globals.css';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      // 'todo' corre las reglas de axe pero no falla el build — sirve como panel de revisión.
      test: 'todo',
    },
  },
  // Toggle de tema en la toolbar: aplica la clase `.dark` sobre <html>, igual que next-themes
  // (estrategia `class`) en la app real. Ver .claude/rules/design-system.md (dark mode).
  decorators: [
    withThemeByClassName({
      themes: {
        light: '',
        dark: 'dark',
      },
      defaultTheme: 'light',
    }),
  ],
};

export default preview;
