'use client';

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Badge } from '@/components/ui/badge';
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
import { Skeleton } from '@/components/ui/skeleton';
import { AvatarUpload } from '@/features/my-profile/components/avatar-upload';
import { useUpdateUserMutation, useUserDetailQuery } from '../hooks';
import { userEditFormSchema, type UserEditFormValues } from '../schemas';

interface UserDetailDialogProps {
  referenceId: string | null;
  onOpenChange: (open: boolean) => void;
}

export function UserDetailDialog({
  referenceId,
  onOpenChange,
}: UserDetailDialogProps) {
  const { data: user, isPending } = useUserDetailQuery(
    referenceId ?? undefined,
  );
  const updateMutation = useUpdateUserMutation(referenceId ?? '');

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm({
    resolver: standardSchemaResolver(userEditFormSchema),
    defaultValues: { firstName: '', lastName: '', phoneNumber: '' },
  });

  useEffect(() => {
    if (user) {
      reset({
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber ?? '',
      });
    }
  }, [user, reset]);

  function onSubmit(values: UserEditFormValues) {
    updateMutation.mutate({
      firstName: values.firstName,
      lastName: values.lastName,
      phoneNumber: values.phoneNumber || undefined,
    });
  }

  return (
    <Dialog open={!!referenceId} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Detalle de usuario</DialogTitle>
          <DialogDescription>
            Ver y editar los datos del usuario. Los cambios requieren permiso de
            administrador — el backend los rechaza si no lo tenés.
          </DialogDescription>
        </DialogHeader>

        {isPending || !user ? (
          <Skeleton className="h-64" />
        ) : (
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <AvatarUpload
                name={`${user.firstName} ${user.lastName}`.trim()}
                currentAvatarUrl={user.avatarUrl}
                onUploaded={(avatarKey) => updateMutation.mutate({ avatarKey })}
              />
              <div>
                <p className="text-sm font-medium">{user.email}</p>
                <Badge variant="outline" className="mt-1">
                  {user.status}
                </Badge>
              </div>
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-4"
            >
              <div className="grid gap-2">
                <Label htmlFor="edit-firstName">Nombre</Label>
                <Input id="edit-firstName" {...register('firstName')} />
                {errors.firstName && (
                  <p className="text-destructive text-sm" role="alert">
                    {errors.firstName.message}
                  </p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="edit-lastName">Apellido</Label>
                <Input id="edit-lastName" {...register('lastName')} />
                {errors.lastName && (
                  <p className="text-destructive text-sm" role="alert">
                    {errors.lastName.message}
                  </p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="edit-phoneNumber">Teléfono</Label>
                <Input id="edit-phoneNumber" {...register('phoneNumber')} />
                {errors.phoneNumber && (
                  <p className="text-destructive text-sm" role="alert">
                    {errors.phoneNumber.message}
                  </p>
                )}
              </div>

              <DialogFooter>
                <Button
                  type="submit"
                  disabled={!isDirty || updateMutation.isPending}
                >
                  {updateMutation.isPending
                    ? 'Guardando...'
                    : 'Guardar cambios'}
                </Button>
              </DialogFooter>
            </form>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
