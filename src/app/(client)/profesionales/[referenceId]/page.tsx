import { ProfessionalDetailCard } from '@/features/browse-professionals/components/professional-detail-card';

export default async function ProfesionalDetailPage({
  params,
}: {
  params: Promise<{ referenceId: string }>;
}) {
  const { referenceId } = await params;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight">
          Perfil del profesional
        </h1>
      </div>
      <ProfessionalDetailCard referenceId={referenceId} />
    </div>
  );
}
