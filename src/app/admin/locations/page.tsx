import { LocationsExplorer } from '@/features/locations/components/locations-explorer';

export default function LocationsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight">
          Ubicaciones
        </h1>
        <p className="text-muted-foreground">
          Profesionales conectados y su posición geográfica en tiempo real.
        </p>
      </div>
      <LocationsExplorer />
    </div>
  );
}
