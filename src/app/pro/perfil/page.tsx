import { ProfessionalProfileForm } from '@/features/professional-profile/components/professional-profile-form';

export default function PerfilPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight">
          Mi perfil
        </h1>
        <p className="text-muted-foreground">
          Editá tu descripción, tarifas y disponibilidad.
        </p>
      </div>
      <ProfessionalProfileForm />
    </div>
  );
}
