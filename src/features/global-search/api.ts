// Búsqueda global cross-entidad — ver openspec/specs/admin-global-search.md. No existe ningún
// endpoint agregador (`GET /admin/search`) en el backend, así que este feature no hace una
// llamada propia: agrega client-side los dos listados que YA soportan un filtro de texto en
// nombre (ver `useGlobalSearchQuery` en `./hooks`):
//   - GET /professionals?search=... (tiene `search` real, documentado, parcial e insensible a
//     mayúsculas — cualquier usuario autenticado puede llamarlo, no es exclusivo de staff).
//   - GET /users?name=... (NO tiene un `search` unificado — `name` es lo más cercano: contains +
//     insensitive sobre firstName/lastName, ver comentario en `features/users/api.ts`. No
//     matchea por email/documentNumber, así que un usuario encontrable por esos campos no
//     aparece acá buscando por texto libre — limitación real, comunicada en la UI).
export type GlobalSearchResultType = 'user' | 'professional';

export interface GlobalSearchResult {
  type: GlobalSearchResultType;
  id: string;
  label: string;
  href: string;
}
