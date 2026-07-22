import { MyServicesTable } from '@/features/professional-services/components/my-services-table';

export default function MisServiciosPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight">
          Mis servicios
        </h1>
        <p className="text-muted-foreground">
          Servicios aceptados, en curso e historial.
        </p>
      </div>
      <MyServicesTable />
    </div>
  );
}
