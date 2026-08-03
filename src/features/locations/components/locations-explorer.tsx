'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { useNearbyProfessionalsQuery } from '../hooks';
import type { GetNearbyProfessionalsParams } from '../api';
import type { NearbySearchValues } from '../schemas';
import { LocationsMap } from './locations-map';
import { NearbySearchForm } from './nearby-search-form';
import { OnlineProfessionalsStat } from './online-professionals-stat';

export function LocationsExplorer() {
  const t = useTranslations('locations');
  const [searchParams, setSearchParams] = useState<
    GetNearbyProfessionalsParams | undefined
  >(undefined);
  const { data, isFetching, isError } =
    useNearbyProfessionalsQuery(searchParams);

  function handleSearch(values: NearbySearchValues) {
    setSearchParams(values);
  }

  return (
    <div className="flex flex-col gap-6">
      <OnlineProfessionalsStat />
      <NearbySearchForm onSearch={handleSearch} isPending={isFetching} />

      {isError && (
        <p className="text-muted-foreground">{t('explorer.loadError')}</p>
      )}

      {isFetching && !data && <Skeleton className="h-[500px] w-full" />}

      {data && (
        <>
          <p className="text-muted-foreground text-sm">
            {data.length === 0
              ? t('explorer.empty')
              : t('explorer.results', { count: data.length })}
          </p>
          <LocationsMap
            professionals={data}
            center={{
              latitude: searchParams?.latitude ?? 0,
              longitude: searchParams?.longitude ?? 0,
            }}
          />
        </>
      )}
    </div>
  );
}
