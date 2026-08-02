import { apiFetch, uploadFile } from '@/core/api-client/client';
import type { components } from '@/core/api-client/types.generated';

export type MeResponse = components['schemas']['MeResponseDTO'];
export type UpdateMeDto = components['schemas']['UpdateMeRequestDTO'];
export type FileInfoResponse = components['schemas']['FileInfoResponseDTO'];

export function updateMe(dto: UpdateMeDto): Promise<MeResponse> {
  return apiFetch<MeResponse>('auth/me', {
    method: 'PUT',
    body: JSON.stringify(dto),
  });
}

// El campo `key` de la respuesta es lo que hay que persistir (vía updateMe({ avatarKey })) — el
// campo `url` es una URL presignada de S3 que expira en 900s, nunca guardarla.
export function uploadAvatar(file: File): Promise<FileInfoResponse> {
  return uploadFile<FileInfoResponse>('uploads/avatar', file);
}
