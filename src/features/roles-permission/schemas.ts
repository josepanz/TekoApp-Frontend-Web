import { z } from 'zod';

// `permissions` se valida acá para la UX del selector (PermissionsPicker), pero NO viaja en el
// payload real de createRole/updateRole -- CreateRoleRequestDTO/UpdateRoleRequestDTO (confirmados
// en types.generated.ts) todavía no exponen un campo `permissions` en el backend. Ver el
// comentario en features/roles-permission/api.ts para el detalle de la discrepancia.
export const roleFormSchema = z.object({
  name: z.string().min(1, 'El nombre es obligatorio'),
  description: z.string().optional(),
  permissions: z.array(z.string()).min(1, 'Seleccioná al menos un permiso'),
});

export type RoleFormValues = z.infer<typeof roleFormSchema>;
