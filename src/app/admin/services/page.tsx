import { ServicesTable } from '@/features/services/components/services-table';

export default function ServicesPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight">
          Servicios
        </h1>
        <p className="text-muted-foreground">
          Monitoreo de los servicios solicitados por clientes en la plataforma.
        </p>
      </div>
      <ServicesTable />
    </div>
  );
}
