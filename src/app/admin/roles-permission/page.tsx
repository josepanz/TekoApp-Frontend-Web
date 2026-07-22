import { Button } from '@/components/ui/button';
import { RoleFormDialog } from '@/features/roles-permission/components/role-form-dialog';
import { RolesTable } from '@/features/roles-permission/components/roles-table';

export default function RolesPermissionPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-semibold tracking-tight">
            Roles y permisos
          </h1>
          <p className="text-muted-foreground">
            Gestión de roles administrativos y los permisos que agrupan.
          </p>
        </div>
        <RoleFormDialog trigger={<Button>Nuevo rol</Button>} />
      </div>
      <RolesTable />
    </div>
  );
}
