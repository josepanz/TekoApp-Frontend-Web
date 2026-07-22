import { RequestServiceForm } from '@/features/request-service/components/request-service-form';

export default function SolicitarPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight">
          Solicitar un profesional
        </h1>
        <p className="text-muted-foreground">
          Contanos qué necesitás y un profesional disponible lo aceptará.
        </p>
      </div>
      <RequestServiceForm />
    </div>
  );
}
