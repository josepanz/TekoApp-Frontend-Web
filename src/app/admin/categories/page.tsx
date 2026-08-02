import { CategoriesTable } from '@/features/categories/components/categories-table';
import { NewCategoryButton } from '@/features/categories/components/new-category-button';
import { getTranslations } from 'next-intl/server';

export default async function CategoriesPage() {
  const t = await getTranslations('pages.admin.categories');
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-semibold tracking-tight">
            {t('title')}
          </h1>
          <p className="text-muted-foreground">{t('description')}</p>
        </div>
        <NewCategoryButton />
      </div>
      <CategoriesTable />
    </div>
  );
}
