import { Button } from '@/components/ui/button';
import { PromotionFormDialog } from '@/features/promotions/components/promotion-form-dialog';
import { PromotionsTable } from '@/features/promotions/components/promotions-table';

export default function PromotionsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-semibold tracking-tight">
            Promociones
          </h1>
          <p className="text-muted-foreground">
            Gestión de promociones y cupones de descuento de la plataforma.
          </p>
        </div>
        <PromotionFormDialog trigger={<Button>Nueva promoción</Button>} />
      </div>
      <PromotionsTable />
    </div>
  );
}
