'use client';

import { Monitor, Moon, Sun } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// `labelKey` en vez del label literal: la traducción se resuelve en el render (hook de next-intl),
// no en el módulo — un objeto a nivel de módulo no puede llamar hooks.
const OPTIONS = [
  { value: 'light', labelKey: 'light', icon: Sun },
  { value: 'dark', labelKey: 'dark', icon: Moon },
  { value: 'system', labelKey: 'system', icon: Monitor },
] as const;

export function ThemeToggle() {
  const t = useTranslations('layout.themeToggle');
  const { theme, setTheme } = useTheme();
  // next-themes solo conoce el tema real después del primer render en el cliente —
  // evita el flash/mismatch de hidratación mostrando un ícono neutro hasta entonces.
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    // Flag de "ya montado en cliente" para evitar flash de hidratación con next-themes —
    // patrón intencional de una sola vez, no el cascading-render que la regla busca evitar.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const CurrentIcon =
    OPTIONS.find((option) => option.value === theme)?.icon ?? Monitor;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="ghost" size="icon" aria-label={t('trigger')}>
            {mounted ? (
              <CurrentIcon aria-hidden="true" />
            ) : (
              <Monitor aria-hidden="true" />
            )}
          </Button>
        }
      />
      <DropdownMenuContent align="end">
        {OPTIONS.map(({ value, labelKey, icon: Icon }) => (
          <DropdownMenuItem key={value} onClick={() => setTheme(value)}>
            <Icon aria-hidden="true" />
            {t(labelKey)}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
