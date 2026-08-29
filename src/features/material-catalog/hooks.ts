import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { toast } from 'sonner';
import { ApiError } from '@/core/api-client/errors';
import {
  createMaterialCatalogItem,
  getMaterialCatalog,
  updateMaterialCatalogItem,
  type CreateMaterialCatalogItemDto,
  type GetMaterialCatalogParams,
  type UpdateMaterialCatalogItemDto,
} from './api';

const MATERIAL_CATALOG_QUERY_KEY = ['material-catalog'];

function getErrorMessage(error: unknown, fallback: string): string {
  return error instanceof ApiError ? error.message : fallback;
}

export function useMaterialCatalogQuery(params: GetMaterialCatalogParams) {
  return useQuery({
    queryKey: [...MATERIAL_CATALOG_QUERY_KEY, params],
    queryFn: () => getMaterialCatalog(params),
    placeholderData: keepPreviousData,
  });
}

export function useCreateMaterialCatalogItemMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateMaterialCatalogItemDto) =>
      createMaterialCatalogItem(dto),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: MATERIAL_CATALOG_QUERY_KEY,
      });
      toast.success('Ítem de catálogo creado correctamente.');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'No se pudo crear el ítem.'));
    },
  });
}

export interface UpdateMaterialCatalogItemVariables {
  referenceId: string;
  dto: UpdateMaterialCatalogItemDto;
}

export function useUpdateMaterialCatalogItemMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ referenceId, dto }: UpdateMaterialCatalogItemVariables) =>
      updateMaterialCatalogItem(referenceId, dto),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: MATERIAL_CATALOG_QUERY_KEY,
      });
      toast.success('Ítem de catálogo actualizado correctamente.');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'No se pudo actualizar el ítem.'));
    },
  });
}
