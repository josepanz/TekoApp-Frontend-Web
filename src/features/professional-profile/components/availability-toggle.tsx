'use client';

import { useTranslations } from 'next-intl';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import type { Professional } from '../api';
import { useUpdateMyAvailabilityMutation } from '../hooks';

export function AvailabilityToggle({
  professional,
}: {
  professional: Professional;
}) {
  const t = useTranslations('professionalProfile.availability');
  const mutation = useUpdateMyAvailabilityMutation();

  return (
    <div className="flex items-center gap-2">
      <Switch
        id="availability"
        checked={professional.isAvailable}
        disabled={mutation.isPending}
        onCheckedChange={(checked) =>
          mutation.mutate({
            id: professional.id,
            dto: { isAvailable: checked },
          })
        }
      />
      <Label htmlFor="availability" className="font-normal">
        {professional.isAvailable ? t('available') : t('unavailable')}
      </Label>
    </div>
  );
}
