'use client';

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useCreateNotificationMutation } from '../hooks';
import {
  NOTIFICATION_CHANNEL_OPTIONS,
  NOTIFICATION_TYPE_OPTIONS,
  newNotificationSchema,
  type NewNotificationFormValues,
} from '../schemas';

// Las etiquetas de tipo (`notifications.type.*`) se comparten con la tabla de notificaciones; las
// de canal viven en `notifications.channel.*`.

export function NewNotificationDialog() {
  const t = useTranslations('notifications');
  const [open, setOpen] = useState(false);
  const createNotificationMutation = useCreateNotificationMutation();

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NewNotificationFormValues>({
    resolver: standardSchemaResolver(newNotificationSchema),
    defaultValues: {
      title: '',
      message: '',
      type: 'system',
      channels: ['in_app'],
    },
  });

  function onSubmit(values: NewNotificationFormValues) {
    createNotificationMutation.mutate(values, {
      onSuccess: () => {
        setOpen(false);
        reset();
      },
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button>{t('form.trigger')}</Button>} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('form.title')}</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={(event) => void handleSubmit(onSubmit)(event)}
          className="flex flex-col gap-4"
          noValidate
        >
          <div className="flex flex-col gap-2">
            <Label htmlFor="title">{t('form.titleLabel')}</Label>
            <Input
              id="title"
              aria-invalid={!!errors.title}
              {...register('title')}
            />
            {errors.title && (
              <p className="text-destructive text-sm">{errors.title.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="message">{t('form.messageLabel')}</Label>
            <Textarea
              id="message"
              aria-invalid={!!errors.message}
              {...register('message')}
            />
            {errors.message && (
              <p className="text-destructive text-sm">
                {errors.message.message}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="type">{t('form.typeLabel')}</Label>
            <Controller
              control={control}
              name="type"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="type" aria-invalid={!!errors.type}>
                    <SelectValue placeholder={t('form.typePlaceholder')} />
                  </SelectTrigger>
                  <SelectContent>
                    {NOTIFICATION_TYPE_OPTIONS.map((option) => (
                      <SelectItem key={option} value={option}>
                        {t(`type.${option}`)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.type && (
              <p className="text-destructive text-sm">{errors.type.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label>{t('form.channelsLabel')}</Label>
            <Controller
              control={control}
              name="channels"
              render={({ field }) => (
                <div className="flex flex-col gap-2">
                  {NOTIFICATION_CHANNEL_OPTIONS.map((channel) => (
                    <div key={channel} className="flex items-center gap-2">
                      <Checkbox
                        id={`channel-${channel}`}
                        checked={field.value.includes(channel)}
                        onCheckedChange={(checked) => {
                          field.onChange(
                            checked
                              ? [...field.value, channel]
                              : field.value.filter((item) => item !== channel),
                          );
                        }}
                      />
                      <Label
                        htmlFor={`channel-${channel}`}
                        className="font-normal"
                      >
                        {t(`channel.${channel}`)}
                      </Label>
                    </div>
                  ))}
                </div>
              )}
            />
            {errors.channels && (
              <p className="text-destructive text-sm">
                {errors.channels.message}
              </p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="submit"
              disabled={createNotificationMutation.isPending}
            >
              {createNotificationMutation.isPending
                ? t('form.pending')
                : t('form.submit')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
