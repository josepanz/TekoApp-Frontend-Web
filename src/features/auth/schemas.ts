import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().min(1, 'El email es obligatorio').email('Email inválido'),
  password: z.string().min(1, 'La contraseña es obligatoria'),
  rememberMe: z.boolean(),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

// Espeja OnboardingUserRequestDTO del backend (POST /onboarding, público) — ver
// TekoApp-Backend/src/api/onboarding/dtos/request/onboarding-user.request.dto.ts.
export const registerSchema = z
  .object({
    firstName: z.string().min(1, 'El nombre es obligatorio'),
    lastName: z.string().min(1, 'El apellido es obligatorio'),
    email: z.string().min(1, 'El email es obligatorio').email('Email inválido'),
    phoneNumber: z.string().min(1, 'El teléfono es obligatorio'),
    password: z
      .string()
      .min(8, 'La contraseña debe tener al menos 8 caracteres'),
    confirmPassword: z.string().min(1, 'Confirmá tu contraseña'),
    acceptTerms: z.boolean().refine((value) => value === true, {
      message: 'Debés aceptar los términos y condiciones',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;
