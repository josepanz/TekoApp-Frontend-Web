import { ProfessionalsTable } from '@/features/professionals/components/professionals-table';

export default function ProfessionalsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight">
          Profesionales
        </h1>
        <p className="text-muted-foreground">
          Verificación y suspensión de perfiles profesionales registrados en la
          plataforma.
        </p>
      </div>
      <ProfessionalsTable />
    </div>
  );
}
