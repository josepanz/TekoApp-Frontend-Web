'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useUserDetailQuery } from '../hooks';
import type { User } from '../api';
import { UserDetailDialog } from './user-detail-dialog';

const STATUS_VARIANT: Record<
  User['status'],
  'default' | 'secondary' | 'destructive'
> = {
  ACTIVE: 'default',
  PENDING_VERIFICATION: 'secondary',
  INACTIVE: 'secondary',
  BLOCKED: 'destructive',
  DELETED: 'destructive',
  REFUSED: 'destructive',
};

function getInitials(name: string): string {
  return (
    name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join('') || '?'
  );
}

export function UserDetailView({ referenceId }: { referenceId: string }) {
  const t = useTranslations('users');
  const tCommon = useTranslations('common');
  const [isEditOpen, setIsEditOpen] = useState(false);
  const { data: user, isPending, isError } = useUserDetailQuery(referenceId);

  if (isPending) {
    return <Skeleton className="h-96 max-w-2xl" />;
  }

  if (isError || !user) {
    return <p className="text-muted-foreground">{t('detail.loadError')}</p>;
  }

  const statusLabel: Record<User['status'], string> = {
    ACTIVE: t('status.ACTIVE'),
    PENDING_VERIFICATION: t('status.PENDING_VERIFICATION'),
    INACTIVE: t('status.INACTIVE'),
    BLOCKED: t('status.BLOCKED'),
    DELETED: t('status.DELETED'),
    REFUSED: t('status.REFUSED'),
  };

  const fullName = `${user.firstName} ${user.lastName}`.trim();

  return (
    <div className="flex max-w-2xl flex-col gap-4">
      <Button
        variant="ghost"
        size="sm"
        className="w-fit"
        nativeButton={false}
        render={
          <Link href="/admin/users">
            <ArrowLeft />
            {t('detail.back')}
          </Link>
        }
      />

      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <Avatar size="lg" className="size-16">
              {user.avatarUrl && <AvatarImage src={user.avatarUrl} alt="" />}
              <AvatarFallback className="text-lg">
                {getInitials(fullName)}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle>{fullName}</CardTitle>
              <p className="text-muted-foreground text-sm">
                {user.email}
                {user.phoneNumber ? ` · ${user.phoneNumber}` : ''}
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditOpen(true)}
          >
            {tCommon('actions.edit')}
          </Button>
        </CardHeader>
        <CardContent>
          <Badge variant={STATUS_VARIANT[user.status]}>
            {statusLabel[user.status]}
          </Badge>
        </CardContent>
      </Card>

      <UserDetailDialog
        referenceId={isEditOpen ? referenceId : null}
        onOpenChange={setIsEditOpen}
      />
    </div>
  );
}
