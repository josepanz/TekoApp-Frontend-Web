import { PendingServicesTable } from '@/features/professional-requests/components/pending-services-table';

export default function SolicitudesPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight">
          Solicitudes
        </h1>
        <p className="text-muted-foreground">
          Servicios pendientes en tu categoría que podés aceptar.
        </p>
      </div>
      <PendingServicesTable />
    </div>
  );
}
