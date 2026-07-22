import { CategoriesTable } from '@/features/categories/components/categories-table';
import { NewCategoryButton } from '@/features/categories/components/new-category-button';

export default function CategoriesPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-semibold tracking-tight">
            Categorías
          </h1>
          <p className="text-muted-foreground">
            Gestión del catálogo de categorías de servicios profesionales.
          </p>
        </div>
        <NewCategoryButton />
      </div>
      <CategoriesTable />
    </div>
  );
}
