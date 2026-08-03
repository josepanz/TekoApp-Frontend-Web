import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { ApiError } from '@/core/api-client/errors';
import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategoryById,
  getCategoryStats,
  toggleCategoryVisibility,
  updateCategory,
  type CreateCategoryDto,
  type UpdateCategoryDto,
} from './api';

export const CATEGORIES_QUERY_KEY = ['categories'];

function getErrorMessage(error: unknown, fallback: string): string {
  return error instanceof ApiError ? error.message : fallback;
}

export function useCategoriesQuery() {
  return useQuery({
    queryKey: CATEGORIES_QUERY_KEY,
    queryFn: getCategories,
  });
}

export function useCategoryDetailQuery(id: number) {
  return useQuery({
    queryKey: ['categories', 'detail', id],
    queryFn: () => getCategoryById(id),
  });
}

// Enriquecimiento opcional de la página de detalle — se consulta aparte de
// `useCategoryDetailQuery` para no bloquear el render principal si las stats tardan o fallan.
export function useCategoryStatsQuery(id: number) {
  return useQuery({
    queryKey: ['categories', 'detail', id, 'stats'],
    queryFn: () => getCategoryStats(id),
  });
}

export function useCreateCategoryMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateCategoryDto) => createCategory(dto),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: CATEGORIES_QUERY_KEY });
      toast.success('Categoría creada correctamente.');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'No se pudo crear la categoría.'));
    },
  });
}

export interface UpdateCategoryVariables {
  id: number;
  dto: UpdateCategoryDto;
}

export function useUpdateCategoryMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: UpdateCategoryVariables) =>
      updateCategory(id, dto),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: CATEGORIES_QUERY_KEY });
      toast.success('Categoría actualizada correctamente.');
    },
    onError: (error) => {
      toast.error(
        getErrorMessage(error, 'No se pudo actualizar la categoría.'),
      );
    },
  });
}

export function useDeleteCategoryMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteCategory(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: CATEGORIES_QUERY_KEY });
      toast.success('Categoría eliminada correctamente.');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'No se pudo eliminar la categoría.'));
    },
  });
}

export function useToggleCategoryVisibilityMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => toggleCategoryVisibility(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: CATEGORIES_QUERY_KEY });
      toast.success('Visibilidad de la categoría actualizada.');
    },
    onError: (error) => {
      toast.error(
        getErrorMessage(error, 'No se pudo actualizar la visibilidad.'),
      );
    },
  });
}
