'use client';

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { SessionUser } from '@/core/auth/session';
import { PushSubscriptionToggle } from '@/features/notifications/components/push-subscription-toggle';
import { useUpdateMeMutation } from '../hooks';
import { profileFormSchema, type ProfileFormValues } from '../schemas';
import { AvatarUpload } from './avatar-upload';

interface ProfileFormProps {
  session: SessionUser;
}

export function ProfileForm({ session }: ProfileFormProps) {
  const t = useTranslations('myProfile');
  const updateMutation = useUpdateMeMutation();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm({
    resolver: standardSchemaResolver(profileFormSchema),
    defaultValues: {
      firstName: session.firstName,
      lastName: session.lastName,
      phoneNumber: '',
    },
  });

  function onSubmit(values: ProfileFormValues) {
    updateMutation.mutate({
      firstName: values.firstName,
      lastName: values.lastName,
      phoneNumber: values.phoneNumber || undefined,
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <AvatarUpload
          name={`${session.firstName} ${session.lastName}`.trim()}
          currentAvatarUrl={session.avatarUrl}
          onUploaded={(avatarKey) => updateMutation.mutate({ avatarKey })}
        />
        <div>
          <p className="text-sm font-medium">{t('avatarHint')}</p>
          <p className="text-muted-foreground text-xs">{session.email}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div className="grid gap-2">
          <Label htmlFor="firstName">{t('firstName')}</Label>
          <Input id="firstName" {...register('firstName')} />
          {errors.firstName && (
            <p className="text-destructive text-sm" role="alert">
              {errors.firstName.message}
            </p>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="lastName">{t('lastName')}</Label>
          <Input id="lastName" {...register('lastName')} />
          {errors.lastName && (
            <p className="text-destructive text-sm" role="alert">
              {errors.lastName.message}
            </p>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="phoneNumber">{t('phoneNumber')}</Label>
          <Input id="phoneNumber" {...register('phoneNumber')} />
          {errors.phoneNumber && (
            <p className="text-destructive text-sm" role="alert">
              {errors.phoneNumber.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          disabled={!isDirty || updateMutation.isPending}
          className="self-start"
        >
          {updateMutation.isPending ? t('saving') : t('save')}
        </Button>
      </form>

      <PushSubscriptionToggle />
    </div>
  );
}
