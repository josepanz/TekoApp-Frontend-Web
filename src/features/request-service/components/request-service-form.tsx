'use client';

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { CategoryLabel } from '@/features/categories/components/category-label';
import {
  useActiveCategoriesQuery,
  useCreateServiceRequestMutation,
  useServiceTypesQuery,
} from '../hooks';
import {
  requestServiceSchema,
  type RequestServiceFormValues,
} from '../schemas';

// Leaflet toca `window` al importarse — carga solo en el cliente (nunca en el paso de SSR).
const LocationPickerMap = dynamic(
  () => import('./location-picker-map').then((m) => m.LocationPickerMap),
  { ssr: false, loading: () => <Skeleton className="h-64 w-full" /> },
);

// Centro de Asunción por defecto — igual criterio que features/locations (mismo mercado inicial).
const DEFAULT_LOCATION = { latitude: -25.2637, longitude: -57.5759 };

export function RequestServiceForm() {
  const t = useTranslations('requestService');
  const router = useRouter();
  const { data: categories, isPending: categoriesPending } =
    useActiveCategoriesQuery();
  const { data: serviceTypes, isPending: serviceTypesPending } =
    useServiceTypesQuery();
  const createMutation = useCreateServiceRequestMutation();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RequestServiceFormValues>({
    resolver: standardSchemaResolver(requestServiceSchema),
    defaultValues: { ...DEFAULT_LOCATION, isUrgent: false },
  });

  if (categoriesPending || serviceTypesPending) {
    return <Skeleton className="h-96 max-w-xl" />;
  }

  function onSubmit(values: RequestServiceFormValues) {
    createMutation.mutate(
      { ...values },
      { onSuccess: () => router.push('/mis-servicios') },
    );
  }

  return (
    <form
      onSubmit={(event) => void handleSubmit(onSubmit)(event)}
      className="flex max-w-xl flex-col gap-4"
      noValidate
    >
      <div className="flex flex-col gap-2">
        <Label htmlFor="title">{t('form.title')}</Label>
        <Input
          id="title"
          aria-invalid={!!errors.title}
          {...register('title')}
        />
        {errors.title && (
          <p className="text-destructive text-sm">{errors.title.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="description">{t('form.description')}</Label>
        <Textarea
          id="description"
          aria-invalid={!!errors.description}
          {...register('description')}
        />
        {errors.description && (
          <p className="text-destructive text-sm">
            {errors.description.message}
          </p>
        )}
      </div>

      <div className="flex gap-4">
        <div className="flex flex-1 flex-col gap-2">
          <Label htmlFor="categoryId">{t('form.category')}</Label>
          <Controller
            control={control}
            name="categoryId"
            render={({ field }) => (
              <Select
                value={field.value ? String(field.value) : undefined}
                onValueChange={(value) => field.onChange(Number(value))}
              >
                <SelectTrigger id="categoryId" aria-label={t('form.category')}>
                  <SelectValue placeholder={t('form.categoryPlaceholder')}>
                    {(value: string | null) => {
                      const selected = categories?.find(
                        (category) => String(category.id) === value,
                      );
                      return selected ? (
                        <CategoryLabel
                          name={selected.name}
                          icon={selected.icon}
                          color={selected.color}
                        />
                      ) : (
                        t('form.categoryPlaceholder')
                      );
                    }}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {categories?.map((category) => (
                    <SelectItem key={category.id} value={String(category.id)}>
                      <CategoryLabel
                        name={category.name}
                        icon={category.icon}
                        color={category.color}
                      />
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.categoryId && (
            <p className="text-destructive text-sm">
              {errors.categoryId.message}
            </p>
          )}
        </div>

        <div className="flex flex-1 flex-col gap-2">
          <Label htmlFor="serviceTypeId">{t('form.serviceType')}</Label>
          <Controller
            control={control}
            name="serviceTypeId"
            render={({ field }) => (
              <Select
                value={field.value ? String(field.value) : undefined}
                onValueChange={(value) => field.onChange(Number(value))}
              >
                <SelectTrigger
                  id="serviceTypeId"
                  aria-label={t('form.serviceType')}
                >
                  <SelectValue placeholder={t('form.serviceTypePlaceholder')} />
                </SelectTrigger>
                <SelectContent>
                  {serviceTypes?.map((type) => (
                    <SelectItem key={type.id} value={String(type.id)}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.serviceTypeId && (
            <p className="text-destructive text-sm">
              {errors.serviceTypeId.message}
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="address">{t('form.address')}</Label>
        <Input
          id="address"
          aria-invalid={!!errors.address}
          {...register('address')}
        />
        {errors.address && (
          <p className="text-destructive text-sm">{errors.address.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label>{t('form.location')}</Label>
        <p className="text-muted-foreground text-sm">
          {t('form.locationHint')}
        </p>
        <Controller
          control={control}
          name="latitude"
          render={({ field: latField }) => (
            <Controller
              control={control}
              name="longitude"
              render={({ field: lngField }) => (
                <LocationPickerMap
                  latitude={latField.value}
                  longitude={lngField.value}
                  onChange={(lat, lng) => {
                    latField.onChange(lat);
                    lngField.onChange(lng);
                  }}
                />
              )}
            />
          )}
        />
      </div>

      <Controller
        control={control}
        name="isUrgent"
        render={({ field }) => (
          <div className="flex items-center gap-2">
            <Checkbox
              id="isUrgent"
              checked={field.value}
              onCheckedChange={(checked) => field.onChange(checked === true)}
            />
            <Label htmlFor="isUrgent" className="font-normal">
              {t('form.urgent')}
            </Label>
          </div>
        )}
      />

      <Button type="submit" disabled={createMutation.isPending}>
        {createMutation.isPending ? t('form.submitting') : t('form.submit')}
      </Button>
    </form>
  );
}
