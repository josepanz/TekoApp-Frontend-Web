'use client';

import { APIProvider, Map, Marker } from '@vis.gl/react-google-maps';
import { useTranslations } from 'next-intl';
import type { NearbyProfessional } from '../api';

interface LocationsMapProps {
  professionals: NearbyProfessional[];
  center: { latitude: number; longitude: number };
}

export interface ProfessionalMarker {
  professional: NearbyProfessional;
  position: { lat: number; lng: number };
}

// Mapea la respuesta (posicion aproximada, `latitude`/`longitude`) a marcadores; descarta los
// profesionales sin coordenadas validas.
export function toMarkers(
  professionals: NearbyProfessional[],
): ProfessionalMarker[] {
  return professionals.flatMap((professional) => {
    if (professional.latitude === null || professional.longitude === null) {
      return [];
    }
    const lat = Number(professional.latitude);
    const lng = Number(professional.longitude);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return [];
    return [{ professional, position: { lat, lng } }];
  });
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

  const markers = toMarkers(professionals);

  return (
    <div className="flex flex-col gap-2">
      <p className="text-muted-foreground text-xs">
        {t('map.approximateNotice')}
      </p>
      <div className="h-[500px] w-full overflow-hidden rounded-md border">
        <APIProvider apiKey={apiKey}>
          <Map
            defaultCenter={{ lat: center.latitude, lng: center.longitude }}
            defaultZoom={12}
            gestureHandling="greedy"
            disableDefaultUI={false}
          >
            {markers.map(({ professional, position }) => (
              <Marker
                key={professional.id}
                position={position}
                title={
                  professional.distanceKm !== undefined
                    ? t('map.markerTitleWithDistance', {
                        id: professional.referenceId.slice(0, 8),
                        rating: Number(professional.averageRating).toFixed(1),
                        distance: professional.distanceKm.toFixed(1),
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
    </div>
  );
}
