'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { ArrowLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useRoleDetailQuery } from '../hooks';
import { RoleFormDialog } from './role-form-dialog';

export function RoleDetailView({ id }: { id: number }) {
  const t = useTranslations('rolesPermission');
  const tCommon = useTranslations('common');
  const { data: role, isPending, isError } = useRoleDetailQuery(id);

  if (isPending) {
    return <Skeleton className="h-96 max-w-2xl" />;
  }

  if (isError || !role) {
    return <p className="text-muted-foreground">{t('detail.loadError')}</p>;
  }

  return (
    <div className="flex max-w-2xl flex-col gap-4">
      <Button
        variant="ghost"
        size="sm"
        className="w-fit"
        nativeButton={false}
        render={
          <Link href="/admin/roles-permission">
            <ArrowLeft />
            {t('detail.back')}
          </Link>
        }
      />

      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-4">
          <div>
            <CardTitle>{role.displayName || role.name}</CardTitle>
            {role.description && (
              <p className="text-muted-foreground text-sm">
                {role.description}
              </p>
            )}
          </div>
          <RoleFormDialog
            role={role}
            trigger={
              <Button variant="outline" size="sm">
                {tCommon('actions.edit')}
              </Button>
            }
          />
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={role.isActive ? 'default' : 'secondary'}>
              {role.isActive ? t('table.active') : t('table.inactive')}
            </Badge>
            <Badge variant="outline">
              {t('detail.permissionsCount', {
                count: role.permissionsCount,
              })}
            </Badge>
          </div>

          {role.permissions.length > 0 && (
            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium">
                {t('detail.permissionsTitle')}
              </span>
              <div className="flex flex-wrap gap-2">
                {role.permissions.map((permission) => (
                  <Badge key={permission.id} variant="secondary">
                    {permission.displayName || permission.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <p className="text-muted-foreground text-xs">
            {t('detail.createdBy', { user: role.createdBy })}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
