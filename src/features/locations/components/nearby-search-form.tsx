'use client';

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { Controller, useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  DEFAULT_SEARCH_CENTER,
  nearbySearchSchema,
  type NearbySearchValues,
} from '../schemas';

interface NearbySearchFormProps {
  onSearch: (values: NearbySearchValues) => void;
  isPending?: boolean;
}

export function NearbySearchForm({
  onSearch,
  isPending,
}: NearbySearchFormProps) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<NearbySearchValues>({
    resolver: standardSchemaResolver(nearbySearchSchema),
    defaultValues: {
      latitude: DEFAULT_SEARCH_CENTER.latitude,
      longitude: DEFAULT_SEARCH_CENTER.longitude,
      radius: 10,
      availableOnly: false,
      onlineOnly: false,
    },
  });

  return (
    <form
      onSubmit={(event) => void handleSubmit(onSearch)(event)}
      className="flex flex-wrap items-end gap-4"
    >
      <div className="flex flex-col gap-2">
        <Label htmlFor="latitude">Latitud</Label>
        <Input
          id="latitude"
          type="number"
          step="any"
          {...register('latitude', { valueAsNumber: true })}
        />
        {errors.latitude && (
          <p className="text-destructive text-sm">{errors.latitude.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="longitude">Longitud</Label>
        <Input
          id="longitude"
          type="number"
          step="any"
          {...register('longitude', { valueAsNumber: true })}
        />
        {errors.longitude && (
          <p className="text-destructive text-sm">{errors.longitude.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="radius">Radio (km)</Label>
        <Input
          id="radius"
          type="number"
          step="any"
          {...register('radius', { valueAsNumber: true })}
        />
        {errors.radius && (
          <p className="text-destructive text-sm">{errors.radius.message}</p>
        )}
      </div>

      <Controller
        control={control}
        name="availableOnly"
        render={({ field }) => (
          <div className="flex items-center gap-2 pb-2">
            <Checkbox
              id="availableOnly"
              checked={field.value}
              onCheckedChange={(checked) => field.onChange(checked === true)}
            />
            <Label htmlFor="availableOnly" className="font-normal">
              Solo disponibles
            </Label>
          </div>
        )}
      />

      <Controller
        control={control}
        name="onlineOnly"
        render={({ field }) => (
          <div className="flex items-center gap-2 pb-2">
            <Checkbox
              id="onlineOnly"
              checked={field.value}
              onCheckedChange={(checked) => field.onChange(checked === true)}
            />
            <Label htmlFor="onlineOnly" className="font-normal">
              Solo en línea
            </Label>
          </div>
        )}
      />

      <Button type="submit" disabled={isPending}>
        {isPending ? 'Buscando...' : 'Buscar'}
      </Button>
    </form>
  );
}
