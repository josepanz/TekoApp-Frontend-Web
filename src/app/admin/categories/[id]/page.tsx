import { CategoryDetailView } from '@/features/categories/components/category-detail-view';
import { getTranslations } from 'next-intl/server';

export default async function CategoryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const t = await getTranslations('pages.admin.categoryDetail');

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight">
          {t('title')}
        </h1>
      </div>
      <CategoryDetailView id={id} />
    </div>
  );
}
