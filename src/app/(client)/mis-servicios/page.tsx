import { MyClientServicesTable } from '@/features/my-services/components/my-client-services-table';

export default function MisServiciosPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight">
          Mis servicios
        </h1>
        <p className="text-muted-foreground">
          Seguimiento de los servicios que solicitaste.
        </p>
      </div>
      <MyClientServicesTable />
    </div>
  );
}
