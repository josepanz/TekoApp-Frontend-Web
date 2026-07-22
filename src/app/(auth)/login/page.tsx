import { Suspense } from 'react';
import { LoginForm } from '@/features/auth/components/login-form';

export default function LoginPage() {
  return (
    <div className="bg-background text-foreground flex min-h-svh flex-col items-center justify-center gap-8 p-6">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="font-heading text-3xl font-semibold tracking-tight">
          TekoApp
        </h1>
        <p className="text-muted-foreground">
          Portal de administración — iniciá sesión para continuar.
        </p>
      </div>
      {/* useSearchParams() en LoginForm exige un límite de Suspense (Next.js 16) */}
      <Suspense>
        <LoginForm />
      </Suspense>
    </div>
  );
}
