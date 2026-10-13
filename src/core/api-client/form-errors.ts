import type { FieldValues, Path, UseFormSetError } from 'react-hook-form';
import { ApiError } from './errors';

/**
 * Mapea los `fieldErrors` (de `error.errors[]` del 400 del backend) a errores de campo de
 * react-hook-form. Solo se aplican los campos que existen en el formulario (`knownFields`);
 * devuelve true si se aplico al menos uno (el caller puede entonces omitir el banner generico).
 */
export function applyApiFieldErrors<T extends FieldValues>(
  error: unknown,
  setError: UseFormSetError<T>,
  knownFields: readonly string[],
): boolean {
  if (!(error instanceof ApiError) || error.status !== 400) return false;

  let applied = false;
  for (const { field, message } of error.fieldErrors) {
    if (!knownFields.includes(field)) continue;
    setError(field as Path<T>, { type: 'server', message });
    applied = true;
  }
  return applied;
}
