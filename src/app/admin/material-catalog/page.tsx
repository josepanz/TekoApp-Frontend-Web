import { getTranslations } from 'next-intl/server';
import { NewMaterialCatalogItemButton } from '@/features/material-catalog/components/new-material-catalog-item-button';
import { MaterialCatalogTable } from '@/features/material-catalog/components/material-catalog-table';

export default async function MaterialCatalogPage() {
  const t = await getTranslations('pages.admin.materialCatalog');
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-semibold tracking-tight">
            {t('title')}
          </h1>
          <p className="text-muted-foreground">{t('description')}</p>
        </div>
        <NewMaterialCatalogItemButton />
      </div>
      <MaterialCatalogTable />
    </div>
  );
}
