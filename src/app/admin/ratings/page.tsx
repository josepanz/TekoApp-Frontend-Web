import { RatingsTable } from '@/features/ratings/components/ratings-table';

export default function RatingsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight">
          Calificaciones
        </h1>
        <p className="text-muted-foreground">
          Moderación de calificaciones reportadas o inapropiadas de la
          plataforma.
        </p>
      </div>
      <RatingsTable />
    </div>
  );
}
