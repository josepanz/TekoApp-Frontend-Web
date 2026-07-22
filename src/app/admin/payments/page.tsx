import { PaymentsTable } from '@/features/payments/components/payments-table';

export default function PaymentsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight">
          Pagos
        </h1>
        <p className="text-muted-foreground">
          Monitoreo y gestión de pagos: reembolsos y cancelaciones.
        </p>
      </div>
      <PaymentsTable />
    </div>
  );
}
