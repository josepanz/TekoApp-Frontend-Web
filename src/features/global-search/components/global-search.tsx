'use client';

import { Search, UserCog, Users } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { useDebouncedValue } from '@/hooks/use-debounced-value';
import { useGlobalSearchQuery } from '../hooks';
import type { GlobalSearchResult } from '../api';

const DEBOUNCE_MS = 300;
const MIN_QUERY_LENGTH = 2;

const ENTITY_ICON: Record<GlobalSearchResult['type'], typeof Users> = {
  user: Users,
  professional: UserCog,
};

// Búsqueda global cross-entidad (ver admin-global-search.md) — opción "federada" client-side:
// sin endpoint agregador, pega en paralelo a /users y /professionals (ver `useGlobalSearchQuery`)
// y combina resultados acá. Atajo Ctrl/Cmd+K (no choca con atajos reservados de Chrome/Edge, que
// usan Ctrl+K para la barra de direcciones SOLO cuando el foco ya está ahí — dentro de la página
// queda libre).
export function GlobalSearch() {
  const t = useTranslations('globalSearch');
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebouncedValue(query, DEBOUNCE_MS);
  const { results, isPending, hasPartialError } =
    useGlobalSearchQuery(debouncedQuery);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault();
        setOpen(true);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);
    if (!nextOpen) {
      setQuery('');
    }
  }

  function handleSelect(result: GlobalSearchResult) {
    handleOpenChange(false);
    router.push(result.href);
  }

  const trimmedLength = query.trim().length;
  const showHint = trimmedLength > 0 && trimmedLength < MIN_QUERY_LENGTH;
  const showEmpty =
    !isPending && trimmedLength >= MIN_QUERY_LENGTH && results.length === 0;

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        aria-label={t('trigger')}
        onClick={() => setOpen(true)}
      >
        <Search />
      </Button>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{t('title')}</DialogTitle>
            <DialogDescription>{t('description')}</DialogDescription>
          </DialogHeader>

          <Input
            autoFocus
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t('placeholder')}
            aria-label={t('placeholder')}
          />

          <div className="flex max-h-80 flex-col gap-1 overflow-y-auto">
            {showHint && (
              <p className="text-muted-foreground p-2 text-sm">
                {t('minLength')}
              </p>
            )}

            {isPending && (
              <div className="flex flex-col gap-2 p-2">
                <Skeleton className="h-8" />
                <Skeleton className="h-8" />
              </div>
            )}

            {showEmpty && (
              <p className="text-muted-foreground p-2 text-sm">
                {t('empty', { query: query.trim() })}
              </p>
            )}

            {hasPartialError && (
              <p className="text-muted-foreground p-2 text-xs">
                {t('partialError')}
              </p>
            )}

            {!isPending &&
              results.map((result) => {
                const Icon = ENTITY_ICON[result.type];
                return (
                  <button
                    key={`${result.type}-${result.id}`}
                    type="button"
                    onClick={() => handleSelect(result)}
                    className="hover:bg-accent hover:text-accent-foreground flex items-center gap-2 rounded-md p-2 text-left text-sm transition-colors"
                  >
                    <Icon className="text-muted-foreground size-4 shrink-0" />
                    <span className="flex flex-col">
                      <span>{result.label}</span>
                      <span className="text-muted-foreground text-xs">
                        {t(`type.${result.type}`)}
                      </span>
                    </span>
                  </button>
                );
              })}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
