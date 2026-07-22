import { ReviewsTable } from '@/features/professional-ratings/components/reviews-table';

export default function CalificacionesPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight">
          Calificaciones
        </h1>
        <p className="text-muted-foreground">
          Reseñas recibidas de tus clientes.
        </p>
      </div>
      <ReviewsTable />
    </div>
  );
}
