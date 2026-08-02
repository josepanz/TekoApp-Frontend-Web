import { PaymentsTable } from '@/features/payments/components/payments-table';
import { getTranslations } from 'next-intl/server';

export default async function PaymentsPage() {
  const t = await getTranslations('pages.admin.payments');
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight">
          {t('title')}
        </h1>
        <p className="text-muted-foreground">{t('description')}</p>
      </div>
      <PaymentsTable />
    </div>
  );
}
