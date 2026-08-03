'use client';

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { Role } from '../api';
import { useCreateRoleMutation, useUpdateRoleMutation } from '../hooks';
import { roleFormSchema, type RoleFormValues } from '../schemas';
import { PermissionsPicker } from './permissions-picker';

const EMPTY_VALUES: RoleFormValues = {
  name: '',
  description: '',
  permissions: [],
};

interface RoleFormDialogProps {
  /**
   * Rol a editar. Si se omite, el diálogo funciona en modo "crear rol". Tipado como `Pick` (no
   * `Role` completo) porque el diálogo solo lee `id`/`name`/`description` — permite reusarlo
   * también desde `RoleDetailView`, que recibe `RoleWithPermissions` (forma distinta, sin
   * `referenceId`).
   */
  role?: Pick<Role, 'id' | 'name' | 'description'>;
  trigger: React.ReactElement;
}

// Diálogo reusado para crear y editar un rol. El selector de permisos (PermissionsPicker) se
// valida en el formulario para UX, pero -- como se documenta en features/roles-permission/api.ts
// -- el backend todavía no acepta un campo `permissions` en CreateRoleRequestDTO/
// UpdateRoleRequestDTO, así que el payload enviado a la mutation nunca lo incluye.
export function RoleFormDialog({ role, trigger }: RoleFormDialogProps) {
  const t = useTranslations('rolesPermission.form');
  const tCommon = useTranslations('common');
  const [open, setOpen] = useState(false);
  const isEditing = Boolean(role);
  const createMutation = useCreateRoleMutation();
  const updateMutation = useUpdateRoleMutation();
  const mutation = isEditing ? updateMutation : createMutation;

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RoleFormValues>({
    resolver: standardSchemaResolver(roleFormSchema),
    defaultValues: EMPTY_VALUES,
  });

  useEffect(() => {
    if (!open) {
      return;
    }
    reset(
      role
        ? {
            name: role.name,
            description: role.description ?? '',
            permissions: [],
          }
        : EMPTY_VALUES,
    );
  }, [open, role, reset]);

  function onSubmit(values: RoleFormValues) {
    const onSuccess = () => setOpen(false);

    if (role) {
      updateMutation.mutate(
        {
          id: role.id,
          dto: { name: values.name, description: values.description },
        },
        { onSuccess },
      );
      return;
    }

    createMutation.mutate(
      { name: values.name, description: values.description },
      { onSuccess },
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={trigger} />
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? t('editTitle') : t('createTitle')}
          </DialogTitle>
          <DialogDescription>
            {isEditing ? t('editDescription') : t('createDescription')}
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={(event) => void handleSubmit(onSubmit)(event)}
          className="flex flex-col gap-4"
          noValidate
        >
          <div className="flex flex-col gap-2">
            <Label htmlFor="role-name">{t('name')}</Label>
            <Input
              id="role-name"
              aria-invalid={!!errors.name}
              {...register('name')}
            />
            {errors.name && (
              <p className="text-destructive text-sm">{errors.name.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="role-description">{t('description')}</Label>
            <Textarea id="role-description" {...register('description')} />
          </div>

          <div className="flex flex-col gap-2">
            <Label>{t('permissions')}</Label>
            <Controller
              control={control}
              name="permissions"
              render={({ field }) => (
                <PermissionsPicker
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
            {errors.permissions && (
              <p className="text-destructive text-sm">
                {errors.permissions.message}
              </p>
            )}
          </div>

          <DialogFooter>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending
                ? tCommon('states.saving')
                : tCommon('actions.save')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
