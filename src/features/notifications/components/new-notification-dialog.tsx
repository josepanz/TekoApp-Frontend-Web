'use client';

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
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
import type { NotificationType } from '../api';

const TYPE_LABEL: Record<NotificationType, string> = {
  service_request: 'Solicitud de servicio',
  service_accepted: 'Servicio aceptado',
  service_rejected: 'Servicio rechazado',
  service_completed: 'Servicio completado',
  payment_received: 'Pago recibido',
  rating_received: 'Calificación recibida',
  promotion: 'Promoción',
  system: 'Sistema',
};

const CHANNEL_LABEL: Record<
  (typeof NOTIFICATION_CHANNEL_OPTIONS)[number],
  string
> = {
  in_app: 'In-app',
  push: 'Push',
  email: 'Email',
};

export function NewNotificationDialog() {
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
      <DialogTrigger render={<Button>Nueva notificación</Button>} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nueva notificación</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={(event) => void handleSubmit(onSubmit)(event)}
          className="flex flex-col gap-4"
          noValidate
        >
          <div className="flex flex-col gap-2">
            <Label htmlFor="title">Título</Label>
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
            <Label htmlFor="message">Mensaje</Label>
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
            <Label htmlFor="type">Tipo</Label>
            <Controller
              control={control}
              name="type"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="type" aria-invalid={!!errors.type}>
                    <SelectValue placeholder="Seleccioná un tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {NOTIFICATION_TYPE_OPTIONS.map((option) => (
                      <SelectItem key={option} value={option}>
                        {TYPE_LABEL[option]}
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
            <Label>Canales</Label>
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
                        {CHANNEL_LABEL[channel]}
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
                ? 'Enviando...'
                : 'Enviar notificación'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
