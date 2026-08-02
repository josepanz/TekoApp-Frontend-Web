'use client';

import { APIProvider, Map, Marker } from '@vis.gl/react-google-maps';
import { useTranslations } from 'next-intl';
import type { NearbyProfessional } from '../api';

interface LocationsMapProps {
  professionals: NearbyProfessional[];
  center: { latitude: number; longitude: number };
}

// `Marker` (legacy), no `AdvancedMarker` — este último exige un `mapId` de Google Cloud Console
// configurado para el proyecto, que no tenemos provisionado todavía.
export function LocationsMap({ professionals, center }: LocationsMapProps) {
  const t = useTranslations('locations');
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return (
      <p className="text-muted-foreground rounded-md border border-dashed p-6 text-sm">
        {t('map.missingApiKey')}
      </p>
    );
  }

  return (
    <div className="h-[500px] w-full overflow-hidden rounded-md border">
      <APIProvider apiKey={apiKey}>
        <Map
          defaultCenter={{ lat: center.latitude, lng: center.longitude }}
          defaultZoom={12}
          gestureHandling="greedy"
          disableDefaultUI={false}
        >
          {professionals
            .filter(
              (p) => p.currentLatitude !== null && p.currentLongitude !== null,
            )
            .map((professional) => (
              <Marker
                key={professional.id}
                position={{
                  lat: Number(professional.currentLatitude),
                  lng: Number(professional.currentLongitude),
                }}
                title={
                  professional.distance !== undefined
                    ? t('map.markerTitleWithDistance', {
                        id: professional.referenceId.slice(0, 8),
                        rating: Number(professional.averageRating).toFixed(1),
                        distance: professional.distance.toFixed(1),
                      })
                    : t('map.markerTitle', {
                        id: professional.referenceId.slice(0, 8),
                        rating: Number(professional.averageRating).toFixed(1),
                      })
                }
              />
            ))}
        </Map>
      </APIProvider>
    </div>
  );
}
