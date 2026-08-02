import { Button } from '@/components/ui/button';
import { RoleFormDialog } from '@/features/roles-permission/components/role-form-dialog';
import { RolesTable } from '@/features/roles-permission/components/roles-table';
import { getTranslations } from 'next-intl/server';

export default async function RolesPermissionPage() {
  const t = await getTranslations('pages.admin.rolesPermission');
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-semibold tracking-tight">
            {t('title')}
          </h1>
          <p className="text-muted-foreground">{t('description')}</p>
        </div>
        <RoleFormDialog trigger={<Button>{t('newButton')}</Button>} />
      </div>
      <RolesTable />
    </div>
  );
}
