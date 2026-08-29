'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { ArrowLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatCurrency, formatDate } from '@/lib/formatters';
import { useAppLocale } from '@/i18n/use-app-locale';
import { ProfessionalDocumentsHistoryTab } from '@/features/professional-documents/components/professional-documents-history-tab';
import { useProfessionalDetailQuery } from '../hooks';
import type { Professional } from '../api';
import { SuspendProfessionalDialog } from './suspend-professional-dialog';
import { VerifyProfessionalDialog } from './verify-professional-dialog';

const STATUS_VARIANT: Record<
  Professional['status'],
  'default' | 'secondary' | 'destructive'
> = {
  PENDING: 'secondary',
  APPROVED: 'default',
  REJECTED: 'destructive',
  SUSPENDED: 'destructive',
};

function getVerificationVariant(
  verificationStatus: string,
): 'default' | 'secondary' | 'destructive' {
  if (verificationStatus === 'verified') return 'default';
  if (verificationStatus === 'rejected') return 'destructive';
  return 'secondary';
}

export function ProfessionalDetailView({
  referenceId,
}: {
  referenceId: string;
}) {
  const t = useTranslations('professionals');
  const locale = useAppLocale();
  const {
    data: professional,
    isPending,
    isError,
  } = useProfessionalDetailQuery(referenceId);

  if (isPending) {
    return <Skeleton className="h-96 max-w-2xl" />;
  }

  if (isError || !professional) {
    return <p className="text-muted-foreground">{t('detail.loadError')}</p>;
  }

  const statusLabel: Record<Professional['status'], string> = {
    PENDING: t('status.PENDING'),
    APPROVED: t('status.APPROVED'),
    REJECTED: t('status.REJECTED'),
    SUSPENDED: t('status.SUSPENDED'),
  };

  return (
    <div className="flex max-w-2xl flex-col gap-4">
      <Button
        variant="ghost"
        size="sm"
        className="w-fit"
        nativeButton={false}
        render={
          <Link href="/admin/professionals">
            <ArrowLeft />
            {t('detail.back')}
          </Link>
        }
      />

      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-4">
          <div>
            <CardTitle>
              {professional.user.firstName} {professional.user.lastName}
            </CardTitle>
            <p className="text-muted-foreground text-sm">
              {professional.user.email}
              {professional.user.phoneNumber
                ? ` · ${professional.user.phoneNumber}`
                : ''}
            </p>
          </div>
          <div className="flex gap-2">
            {professional.verificationStatus !== 'verified' && (
              <VerifyProfessionalDialog professional={professional} />
            )}
            {professional.status !== 'SUSPENDED' && (
              <SuspendProfessionalDialog professional={professional} />
            )}
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={STATUS_VARIANT[professional.status]}>
              {statusLabel[professional.status]}
            </Badge>
            <Badge
              variant={getVerificationVariant(professional.verificationStatus)}
            >
              {professional.verificationStatus}
            </Badge>
            <Badge
              variant={
                professional.requiredDocumentsVerified ? 'default' : 'secondary'
              }
            >
              {professional.requiredDocumentsVerified
                ? t('detail.requiredDocumentsVerified')
                : t('detail.requiredDocumentsNotVerified')}
            </Badge>
            <Badge variant={professional.isAvailable ? 'default' : 'secondary'}>
              {professional.isAvailable ? t('table.yes') : t('table.no')} —{' '}
              {t('detail.availableLabel')}
            </Badge>
            <Badge>{professional.category.name}</Badge>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="detail">
        <TabsList>
          <TabsTrigger value="detail">{t('detail.tabs.profile')}</TabsTrigger>
          <TabsTrigger value="documents">
            {t('detail.tabs.documents')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="detail">
          <Card>
            <CardContent className="flex flex-col gap-4 pt-6">
              <p className="text-muted-foreground">
                {professional.description}
              </p>

              <div className="flex flex-wrap gap-4 text-sm">
                <span>
                  {t('detail.hourlyRate', {
                    rate: formatCurrency(Number(professional.hourlyRate)),
                  })}
                </span>
                <span>
                  {t('detail.experience', {
                    years: professional.yearsOfExperience,
                  })}
                </span>
                <span>
                  {t('detail.rating', {
                    rating: Number(professional.averageRating).toFixed(1),
                    count: professional.totalRatings,
                  })}
                </span>
                <span>
                  {t('detail.totalServices', {
                    count: professional.totalServices,
                  })}
                </span>
              </div>

              {professional.skills.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {professional.skills.map((skill) => (
                    <Badge key={skill} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              )}

              {professional.certifications.length > 0 && (
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium">
                    {t('detail.certifications')}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {professional.certifications.map((certification) => (
                      <Badge key={certification} variant="outline">
                        {certification}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <p className="text-muted-foreground text-xs">
                {t('detail.memberSince', {
                  date: formatDate(professional.createdAt, locale),
                })}
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents">
          <Card>
            <CardContent className="pt-6">
              <ProfessionalDocumentsHistoryTab
                professionalReferenceId={referenceId}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
