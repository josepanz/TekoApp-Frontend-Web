import { z } from 'zod';

// Centro de búsqueda por defecto: Asunción, Paraguay — sede de operación de TekoApp.
export const DEFAULT_SEARCH_CENTER = {
  latitude: -25.2637,
  longitude: -57.5759,
};

export const nearbySearchSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  radius: z.number().positive(),
  availableOnly: z.boolean(),
  onlineOnly: z.boolean(),
});

export type NearbySearchValues = z.infer<typeof nearbySearchSchema>;
