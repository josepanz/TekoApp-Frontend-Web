'use client';

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
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
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import type { CreatePromotionRequest, Promotion } from '../api';
import {
  useCreatePromotionMutation,
  useUpdatePromotionMutation,
} from '../hooks';
import {
  promotionFormSchema,
  type PromotionFormInput,
  type PromotionFormValues,
} from '../schemas';

const TYPE_OPTIONS: { value: PromotionFormValues['type']; label: string }[] = [
  { value: 'PERCENTAGE', label: 'Porcentaje' },
  { value: 'FIXED_AMOUNT', label: 'Monto fijo' },
  { value: 'FREE_SERVICE', label: 'Servicio gratis' },
];

interface PromotionFormDialogProps {
  /** Promoción a editar. Si se omite, el diálogo funciona en modo creación. */
  promotion?: Promotion;
  /** Elemento que abre el diálogo (botón "Nueva promoción" o "Editar" según el modo). */
  trigger: React.ReactElement;
}

// Fechas: PromotionDetailResponseDTO/CreatePromotionRequestDTO usan ISO 8601 completo
// (2025-01-01T00:00:00Z), pero el form usa <input type="date"> (YYYY-MM-DD) — se convierte en
// los bordes del componente.
function toDateInputValue(isoDate: string): string {
  return isoDate.slice(0, 10);
}

function toIsoDateTime(dateInputValue: string): string {
  return new Date(dateInputValue).toISOString();
}

function buildDefaultValues(promotion?: Promotion): PromotionFormInput {
  if (!promotion) {
    return {
      code: '',
      name: '',
      description: '',
      type: 'PERCENTAGE',
      discountValue: 0,
      minimumAmount: undefined,
      maximumDiscount: undefined,
      maxUsage: undefined,
      maxUsagePerUser: undefined,
      validFrom: '',
      validUntil: '',
      isFirstTimeOnly: false,
      isProfessionalOnly: false,
      isClientOnly: false,
    };
  }

  const discountValue =
    promotion.type === 'PERCENTAGE'
      ? (promotion.discountPercentage ?? 0)
      : promotion.type === 'FIXED_AMOUNT'
        ? (promotion.discountAmount ?? 0)
        : 0;

  return {
    code: promotion.code,
    name: promotion.name,
    description: promotion.description ?? '',
    type: promotion.type,
    discountValue,
    minimumAmount: promotion.minimumAmount,
    maximumDiscount: promotion.maximumDiscount,
    maxUsage: promotion.maxUsage === -1 ? undefined : promotion.maxUsage,
    maxUsagePerUser: promotion.maxUsagePerUser,
    validFrom: toDateInputValue(promotion.validFrom),
    validUntil: toDateInputValue(promotion.validUntil),
    // PromotionDetailResponseDTO no devuelve isFirstTimeOnly/isProfessionalOnly/isClientOnly (solo
    // el `allowedUserTypes` derivado) — al editar, estos switches arrancan en `false` y el usuario
    // los vuelve a marcar si corresponde; no hay forma de precargarlos desde la respuesta real.
    isFirstTimeOnly: false,
    isProfessionalOnly: false,
    isClientOnly: false,
  };
}

function toCreatePromotionRequest(
  values: PromotionFormValues,
): CreatePromotionRequest {
  return {
    code: values.code,
    name: values.name,
    description: values.description || undefined,
    type: values.type,
    discountValue: values.discountValue,
    minimumAmount: values.minimumAmount,
    maximumDiscount: values.maximumDiscount,
    maxUsage: values.maxUsage,
    maxUsagePerUser: values.maxUsagePerUser,
    validFrom: toIsoDateTime(values.validFrom),
    validUntil: toIsoDateTime(values.validUntil),
    isFirstTimeOnly: values.isFirstTimeOnly,
    isProfessionalOnly: values.isProfessionalOnly,
    isClientOnly: values.isClientOnly,
  };
}

export function PromotionFormDialog({
  promotion,
  trigger,
}: PromotionFormDialogProps) {
  const [open, setOpen] = useState(false);
  const isEditMode = !!promotion;
  const createMutation = useCreatePromotionMutation();
  const updateMutation = useUpdatePromotionMutation();
  const isPending = createMutation.isPending || updateMutation.isPending;

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PromotionFormInput, unknown, PromotionFormValues>({
    resolver: standardSchemaResolver(promotionFormSchema),
    defaultValues: buildDefaultValues(promotion),
  });

  // El diálogo de edición se instancia una vez por fila y permanece montado — resetear los
  // valores cada vez que se abre asegura que reflejen la promoción actual (o el formulario en
  // blanco en modo creación).
  useEffect(() => {
    if (open) {
      reset(buildDefaultValues(promotion));
    }
  }, [open, promotion, reset]);

  function onSubmit(values: PromotionFormValues) {
    const dto = toCreatePromotionRequest(values);

    if (isEditMode) {
      updateMutation.mutate(
        { id: promotion.id, dto },
        { onSuccess: () => setOpen(false) },
      );
      return;
    }

    createMutation.mutate(dto, {
      onSuccess: () => {
        setOpen(false);
        reset(buildDefaultValues());
      },
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={trigger} />
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? 'Editar promoción' : 'Nueva promoción'}
          </DialogTitle>
        </DialogHeader>
        <form
          onSubmit={(event) => void handleSubmit(onSubmit)(event)}
          className="flex flex-col gap-4"
          noValidate
        >
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="code">Código</Label>
              <Input
                id="code"
                aria-invalid={!!errors.code}
                {...register('code')}
              />
              {errors.code && (
                <p className="text-destructive text-sm">
                  {errors.code.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="name">Nombre</Label>
              <Input
                id="name"
                aria-invalid={!!errors.name}
                {...register('name')}
              />
              {errors.name && (
                <p className="text-destructive text-sm">
                  {errors.name.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea id="description" {...register('description')} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="type">Tipo de descuento</Label>
              <Controller
                control={control}
                name="type"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="type" className="w-full">
                      <SelectValue placeholder="Seleccioná un tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      {TYPE_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.type && (
                <p className="text-destructive text-sm">
                  {errors.type.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="discountValue">Valor del descuento</Label>
              <Input
                id="discountValue"
                type="number"
                step="any"
                aria-invalid={!!errors.discountValue}
                {...register('discountValue')}
              />
              {errors.discountValue && (
                <p className="text-destructive text-sm">
                  {errors.discountValue.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="validFrom">Vigente desde</Label>
              <Input
                id="validFrom"
                type="date"
                aria-invalid={!!errors.validFrom}
                {...register('validFrom')}
              />
              {errors.validFrom && (
                <p className="text-destructive text-sm">
                  {errors.validFrom.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="validUntil">Vigente hasta</Label>
              <Input
                id="validUntil"
                type="date"
                aria-invalid={!!errors.validUntil}
                {...register('validUntil')}
              />
              {errors.validUntil && (
                <p className="text-destructive text-sm">
                  {errors.validUntil.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="minimumAmount">Monto mínimo</Label>
              <Input
                id="minimumAmount"
                type="number"
                step="any"
                {...register('minimumAmount')}
              />
              {errors.minimumAmount && (
                <p className="text-destructive text-sm">
                  {errors.minimumAmount.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="maximumDiscount">Descuento máximo</Label>
              <Input
                id="maximumDiscount"
                type="number"
                step="any"
                {...register('maximumDiscount')}
              />
              {errors.maximumDiscount && (
                <p className="text-destructive text-sm">
                  {errors.maximumDiscount.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="maxUsage">Usos máximos</Label>
              <Input id="maxUsage" type="number" {...register('maxUsage')} />
              {errors.maxUsage && (
                <p className="text-destructive text-sm">
                  {errors.maxUsage.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="maxUsagePerUser">Usos máximos por usuario</Label>
              <Input
                id="maxUsagePerUser"
                type="number"
                {...register('maxUsagePerUser')}
              />
              {errors.maxUsagePerUser && (
                <p className="text-destructive text-sm">
                  {errors.maxUsagePerUser.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Controller
              control={control}
              name="isFirstTimeOnly"
              render={({ field }) => (
                <div className="flex items-center gap-2">
                  <Switch
                    id="isFirstTimeOnly"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                  <Label htmlFor="isFirstTimeOnly" className="font-normal">
                    Solo para el primer uso del usuario
                  </Label>
                </div>
              )}
            />

            <Controller
              control={control}
              name="isProfessionalOnly"
              render={({ field }) => (
                <div className="flex items-center gap-2">
                  <Switch
                    id="isProfessionalOnly"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                  <Label htmlFor="isProfessionalOnly" className="font-normal">
                    Solo para profesionales
                  </Label>
                </div>
              )}
            />

            <Controller
              control={control}
              name="isClientOnly"
              render={({ field }) => (
                <div className="flex items-center gap-2">
                  <Switch
                    id="isClientOnly"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                  <Label htmlFor="isClientOnly" className="font-normal">
                    Solo para clientes
                  </Label>
                </div>
              )}
            />
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending
                ? 'Guardando...'
                : isEditMode
                  ? 'Guardar cambios'
                  : 'Crear promoción'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
