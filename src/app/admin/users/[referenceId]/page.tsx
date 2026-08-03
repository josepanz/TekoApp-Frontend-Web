import { UserDetailView } from '@/features/users/components/user-detail-view';
import { getTranslations } from 'next-intl/server';

export default async function UserDetailPage({
  params,
}: {
  params: Promise<{ referenceId: string }>;
}) {
  const { referenceId } = await params;
  const t = await getTranslations('pages.admin.userDetail');

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight">
          {t('title')}
        </h1>
      </div>
      <UserDetailView referenceId={referenceId} />
    </div>
  );
}
