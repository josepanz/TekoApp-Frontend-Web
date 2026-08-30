'use client';

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { AlertCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PasswordInput } from '@/components/ui/password-input';
import { ApiError } from '@/core/api-client/errors';
import { useRegisterMutation } from '../hooks';
import { registerSchema, type RegisterFormValues } from '../schemas';

export function RegisterForm() {
  const t = useTranslations('auth.register');
  const router = useRouter();
  const registerMutation = useRegisterMutation();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: standardSchemaResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      password: '',
      confirmPassword: '',
      acceptTerms: false,
    },
  });

  function onSubmit(values: RegisterFormValues) {
    registerMutation.mutate(values, {
      onSuccess: () => router.push('/login?registered=1'),
    });
  }

  const errorMessage =
    registerMutation.error instanceof ApiError
      ? registerMutation.error.message
      : registerMutation.error
        ? t('genericError')
        : null;

  return (
    <form
      onSubmit={(event) => void handleSubmit(onSubmit)(event)}
      className="flex w-full max-w-sm flex-col gap-5"
      noValidate
    >
      {errorMessage && (
        <Alert variant="destructive">
          <AlertCircle />
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}

      <div className="flex gap-4">
        <div className="flex flex-1 flex-col gap-2">
          <Label htmlFor="firstName">{t('firstName')}</Label>
          <Input
            id="firstName"
            autoComplete="given-name"
            aria-invalid={!!errors.firstName}
            {...register('firstName')}
          />
          {errors.firstName && (
            <p className="text-destructive text-sm">
              {errors.firstName.message}
            </p>
          )}
        </div>
        <div className="flex flex-1 flex-col gap-2">
          <Label htmlFor="lastName">{t('lastName')}</Label>
          <Input
            id="lastName"
            autoComplete="family-name"
            aria-invalid={!!errors.lastName}
            {...register('lastName')}
          />
          {errors.lastName && (
            <p className="text-destructive text-sm">
              {errors.lastName.message}
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="email">{t('email')}</Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          aria-invalid={!!errors.email}
          {...register('email')}
        />
        {errors.email && (
          <p className="text-destructive text-sm">{errors.email.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="phoneNumber">{t('phoneNumber')}</Label>
        <Input
          id="phoneNumber"
          type="tel"
          autoComplete="tel"
          aria-invalid={!!errors.phoneNumber}
          {...register('phoneNumber')}
        />
        {errors.phoneNumber && (
          <p className="text-destructive text-sm">
            {errors.phoneNumber.message}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="password">{t('password')}</Label>
        <PasswordInput
          id="password"
          autoComplete="new-password"
          aria-invalid={!!errors.password}
          {...register('password')}
        />
        {errors.password && (
          <p className="text-destructive text-sm">{errors.password.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="confirmPassword">{t('confirmPassword')}</Label>
        <PasswordInput
          id="confirmPassword"
          autoComplete="new-password"
          aria-invalid={!!errors.confirmPassword}
          {...register('confirmPassword')}
        />
        {errors.confirmPassword && (
          <p className="text-destructive text-sm">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      <Controller
        control={control}
        name="acceptTerms"
        render={({ field }) => (
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <Checkbox
                id="acceptTerms"
                checked={field.value}
                onCheckedChange={(checked) => field.onChange(checked === true)}
                aria-invalid={!!errors.acceptTerms}
              />
              <Label htmlFor="acceptTerms" className="font-normal">
                {t('acceptTerms')}
              </Label>
            </div>
            {errors.acceptTerms && (
              <p className="text-destructive text-sm">
                {errors.acceptTerms.message}
              </p>
            )}
          </div>
        )}
      />

      <Button type="submit" disabled={registerMutation.isPending}>
        {registerMutation.isPending ? t('submitting') : t('submit')}
      </Button>

      <p className="text-muted-foreground text-center text-sm">
        {t('hasAccount')}{' '}
        <Link href="/login" className="text-primary underline">
          {t('signIn')}
        </Link>
      </p>
    </form>
  );
}
