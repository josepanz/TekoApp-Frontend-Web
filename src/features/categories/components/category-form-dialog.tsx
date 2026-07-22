'use client';

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { ApiError } from '@/core/api-client/errors';
import type { Category, CreateCategoryDto } from '../api';
import { useCreateCategoryMutation, useUpdateCategoryMutation } from '../hooks';
import { categoryFormSchema, type CategoryFormValues } from '../schemas';

interface CategoryFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category?: Category;
}

function buildDefaultValues(category?: Category): CategoryFormValues {
  return {
    name: category?.name ?? '',
    slug: category?.slug ?? '',
    description: category?.description ?? '',
    icon: category?.icon ?? '',
    color: category?.color ?? '',
    isVisible: category?.isVisible ?? true,
    parentCategoryId: category?.parentCategoryId ?? undefined,
  };
}

// El payload de creación y edición comparte forma (CreateCategoryDto/UpdateCategoryDto tienen los
// mismos campos en la práctica) — se arma una sola vez y se reusa para ambas mutations.
// `sortOrder`/`status`/`requiresVerification` no se exponen como input en el diálogo (ver
// schemas.ts): al editar viajan sin cambios desde la categoría original, al crear usan los
// mismos defaults que documenta CreateCategoryDto en el Swagger (0 / ACTIVE / false).
function buildPayload(
  values: CategoryFormValues,
  category?: Category,
): CreateCategoryDto {
  return {
    name: values.name,
    slug: values.slug || undefined,
    description: values.description || undefined,
    icon: values.icon || undefined,
    color: values.color || undefined,
    sortOrder: category?.sortOrder ?? 0,
    status: category?.status ?? 'ACTIVE',
    isVisible: values.isVisible,
    requiresVerification: category?.requiresVerification ?? false,
    parentCategoryId: values.parentCategoryId,
  };
}

export function CategoryFormDialog({
  open,
  onOpenChange,
  category,
}: CategoryFormDialogProps) {
  const isEditing = !!category;
  const createMutation = useCreateCategoryMutation();
  const updateMutation = useUpdateCategoryMutation();
  const mutation = isEditing ? updateMutation : createMutation;

  // Sin generic explícito en useForm: se deja que el tipo de los campos se infiera del propio
  // resolver. `parentCategoryId` usa transform/refine en el schema (ver schemas.ts) para
  // normalizar NaN → undefined, lo que cambia esa clave de opcional (`?:`) a requerida-pero-
  // undefined-posible (`: number | undefined`) en el tipo inferido — pasar un generic explícito
  // (`CategoryFormValues`, que viene de `z.infer` "puro") choca con esa forma y rompe la
  // asignación de tipos de `Resolver<T>` de @hookform/resolvers.
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: standardSchemaResolver(categoryFormSchema),
    defaultValues: buildDefaultValues(category),
  });

  useEffect(() => {
    if (open) {
      reset(buildDefaultValues(category));
    }
  }, [open, category, reset]);

  function onSubmit(values: CategoryFormValues) {
    const payload = buildPayload(values, category);
    if (category) {
      updateMutation.mutate(
        { id: category.id, dto: payload },
        { onSuccess: () => onOpenChange(false) },
      );
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => onOpenChange(false),
      });
    }
  }

  const errorMessage =
    mutation.error instanceof ApiError
      ? mutation.error.message
      : mutation.error
        ? 'Ocurrió un error inesperado. Intentá de nuevo.'
        : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form
          onSubmit={(event) => void handleSubmit(onSubmit)(event)}
          className="flex flex-col gap-4"
          noValidate
        >
          <DialogHeader>
            <DialogTitle>
              {isEditing ? 'Editar categoría' : 'Nueva categoría'}
            </DialogTitle>
            <DialogDescription>
              {isEditing
                ? 'Modificá los datos de la categoría seleccionada.'
                : 'Completá los datos para crear una nueva categoría de servicios.'}
            </DialogDescription>
          </DialogHeader>

          {errorMessage && (
            <p className="text-destructive text-sm">{errorMessage}</p>
          )}

          <div className="flex flex-col gap-2">
            <Label htmlFor="name">Nombre</Label>
            <Input
              id="name"
              aria-invalid={!!errors.name}
              {...register('name')}
            />
            {errors.name && (
              <p className="text-destructive text-sm">{errors.name.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="slug">Slug</Label>
            <Input
              id="slug"
              placeholder="Se autogenera si se omite"
              aria-invalid={!!errors.slug}
              {...register('slug')}
            />
            {errors.slug && (
              <p className="text-destructive text-sm">{errors.slug.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea id="description" {...register('description')} />
          </div>

          <div className="flex gap-4">
            <div className="flex flex-1 flex-col gap-2">
              <Label htmlFor="icon">Ícono</Label>
              <Input
                id="icon"
                placeholder="wrench-outline"
                {...register('icon')}
              />
            </div>

            <div className="flex flex-1 flex-col gap-2">
              <Label htmlFor="color">Color</Label>
              <Input
                id="color"
                placeholder="#2ecc71"
                aria-invalid={!!errors.color}
                {...register('color')}
              />
              {errors.color && (
                <p className="text-destructive text-sm">
                  {errors.color.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="parentCategoryId">
              ID de categoría padre (opcional)
            </Label>
            <Input
              id="parentCategoryId"
              type="number"
              min={1}
              aria-invalid={!!errors.parentCategoryId}
              {...register('parentCategoryId', { valueAsNumber: true })}
            />
            {errors.parentCategoryId && (
              <p className="text-destructive text-sm">
                {errors.parentCategoryId.message}
              </p>
            )}
          </div>

          <Controller
            control={control}
            name="isVisible"
            render={({ field }) => (
              <div className="flex items-center gap-2">
                <Switch
                  id="isVisible"
                  checked={field.value}
                  onCheckedChange={(checked) => field.onChange(checked)}
                />
                <Label htmlFor="isVisible" className="font-normal">
                  Visible en el buscador de clientes
                </Label>
              </div>
            )}
          />

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending
                ? 'Guardando...'
                : isEditing
                  ? 'Guardar cambios'
                  : 'Crear categoría'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
