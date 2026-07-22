import { UsersTable } from '@/features/users/components/users-table';

export default function UsersPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight">
          Usuarios
        </h1>
        <p className="text-muted-foreground">
          Gestión de clientes y profesionales registrados en la plataforma.
        </p>
      </div>
      <UsersTable />
    </div>
  );
}
