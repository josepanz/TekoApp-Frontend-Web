'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { urlBase64ToUint8Array } from '@/lib/web-push';
import {
  useSubscribePushMutation,
  useUnsubscribePushMutation,
  useVapidPublicKeyQuery,
} from '../hooks';

const STORAGE_KEY = 'teko-push-subscription-reference-id';

type SupportState = 'checking' | 'unsupported' | 'denied' | 'ready';

/**
 * Opt-in de Web Push (VAPID) — ver TekoApp-Backend/.claude/documentation/notifications-push-architecture.md.
 * Complementario al SSE de `NotificationBell` (que solo cubre "pestaña abierta ahora mismo"): esto
 * cubre notificación con el navegador cerrado, vía el Service Worker registrado en `public/sw.js`.
 */
export function PushSubscriptionToggle() {
  const t = useTranslations('myProfile.push');
  const [support, setSupport] = useState<SupportState>('checking');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const vapidQuery = useVapidPublicKeyQuery();
  const subscribeMutation = useSubscribePushMutation();
  const unsubscribeMutation = useUnsubscribePushMutation();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Detección de soporte de navegador — solo existe después de montar en cliente (SSR no
    // conoce `navigator`/`Notification`), mismo patrón de una sola vez que ThemeToggle usa para
    // evitar el flash/mismatch de hidratación (no es el cascading-render que la regla busca evitar).
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSupport('unsupported');
      return;
    }
    if (Notification.permission === 'denied') {
      setSupport('denied');
      return;
    }

    setSupport('ready');
    void navigator.serviceWorker
      .getRegistration()
      .then(async (registration) => {
        const subscription = await registration?.pushManager.getSubscription();
        setIsSubscribed(Boolean(subscription));
      });
  }, []);

  async function subscribe() {
    if (!vapidQuery.data) return;

    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      setSupport('denied');
      return;
    }

    const registration = await navigator.serviceWorker.register('/sw.js');
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(vapidQuery.data.publicKey),
    });
    const json = subscription.toJSON();
    if (!json.endpoint || !json.keys?.p256dh || !json.keys.auth) return;

    subscribeMutation.mutate(
      {
        endpoint: json.endpoint,
        keys: { p256dh: json.keys.p256dh, auth: json.keys.auth },
        userAgent: navigator.userAgent,
      },
      {
        onSuccess: (result) => {
          localStorage.setItem(STORAGE_KEY, result.referenceId);
          setIsSubscribed(true);
        },
      },
    );
  }

  async function unsubscribe() {
    const registration = await navigator.serviceWorker.getRegistration();
    const subscription = await registration?.pushManager.getSubscription();
    await subscription?.unsubscribe();

    const referenceId = localStorage.getItem(STORAGE_KEY);
    if (referenceId) {
      unsubscribeMutation.mutate(referenceId, {
        onSettled: () => localStorage.removeItem(STORAGE_KEY),
      });
    }
    setIsSubscribed(false);
  }

  function handleToggle(checked: boolean) {
    void (checked ? subscribe() : unsubscribe());
  }

  if (support === 'unsupported' || support === 'checking') return null;

  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border p-4">
      <div>
        <Label htmlFor="push-subscription-toggle">{t('title')}</Label>
        <p className="text-muted-foreground text-xs">
          {support === 'denied' ? t('blocked') : t('hint')}
        </p>
      </div>
      <Switch
        id="push-subscription-toggle"
        checked={isSubscribed}
        disabled={
          support === 'denied' ||
          !vapidQuery.data ||
          subscribeMutation.isPending ||
          unsubscribeMutation.isPending
        }
        onCheckedChange={handleToggle}
      />
    </div>
  );
}
