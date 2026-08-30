'use client';

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { AlertCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PasswordInput } from '@/components/ui/password-input';
import { ApiError } from '@/core/api-client/errors';
import { useLoginMutation } from '../hooks';
import { loginSchema, type LoginFormValues } from '../schemas';

export function LoginForm() {
  const t = useTranslations('auth.login');
  const router = useRouter();
  const searchParams = useSearchParams();
  const loginMutation = useLoginMutation();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: standardSchemaResolver(loginSchema),
    defaultValues: { email: '', password: '', rememberMe: false },
  });

  function onSubmit(values: LoginFormValues) {
    loginMutation.mutate(values, {
      onSuccess: () => {
        const redirectTo = searchParams.get('from') || '/';
        router.push(redirectTo);
        router.refresh();
      },
    });
  }

  const errorMessage =
    loginMutation.error instanceof ApiError
      ? loginMutation.error.message
      : loginMutation.error
        ? 'No se pudo iniciar sesión. Intentá de nuevo.'
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
        <Label htmlFor="password">{t('password')}</Label>
        <PasswordInput
          id="password"
          autoComplete="current-password"
          aria-invalid={!!errors.password}
          {...register('password')}
        />
        {errors.password && (
          <p className="text-destructive text-sm">{errors.password.message}</p>
        )}
      </div>

      <Controller
        control={control}
        name="rememberMe"
        render={({ field }) => (
          <div className="flex items-center gap-2">
            <Checkbox
              id="rememberMe"
              checked={field.value}
              onCheckedChange={(checked) => field.onChange(checked)}
            />
            <Label htmlFor="rememberMe" className="font-normal">
              {t('rememberMe')}
            </Label>
          </div>
        )}
      />

      <Button type="submit" disabled={loginMutation.isPending}>
        {loginMutation.isPending ? t('submitting') : t('submit')}
      </Button>

      <p className="text-muted-foreground text-center text-sm">
        {t('noAccount')}{' '}
        <Link href="/register" className="text-primary underline">
          {t('signUp')}
        </Link>
      </p>
    </form>
  );
}
