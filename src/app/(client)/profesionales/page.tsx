import { BrowseProfessionalsList } from '@/features/browse-professionals/components/browse-professionals-list';

export default function ProfesionalesPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight">
          Profesionales
        </h1>
        <p className="text-muted-foreground">
          Buscá profesionales disponibles y su reputación.
        </p>
      </div>
      <BrowseProfessionalsList />
    </div>
  );
}
