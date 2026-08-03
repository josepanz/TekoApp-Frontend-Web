// Genera el scaffolding de una "feature con tabla" (CRUD admin: listado + crear/editar + eliminar)
// siguiendo el patrón real del repo (ver src/features/categories como referencia).
//
// Uso:
//   pnpm generate:feature <nombre-en-kebab-case-singular> [plural-kebab] [--paginated] [--force]
//
// Ejemplos:
//   pnpm generate:feature promotion
//   pnpm generate:feature promotion --paginated
//   pnpm generate:feature category-tax category-taxes   (plural explícito si la heurística falla)
//
// Crea:
//   src/features/<plural>/api.ts
//   src/features/<plural>/hooks.ts
//   src/features/<plural>/schemas.ts
//   src/features/<plural>/components/<plural>-table.tsx
//   src/features/<plural>/components/<singular>-form-dialog.tsx
//   src/features/<plural>/components/new-<singular>-button.tsx
//   src/app/admin/<plural>/page.tsx
//
// NO sobreescribe archivos existentes salvo que pases --force. Los archivos generados son un
// PUNTO DE PARTIDA editable (no se re-sobreescriben como types.generated.ts / theme.generated.css).
import { access, mkdir, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import prettier from 'prettier';

const ROOT = fileURLToPath(new URL('..', import.meta.url));

function usage(message) {
  if (message) console.error(`Error: ${message}\n`);
  console.error(
    'Uso: pnpm generate:feature <nombre-en-kebab-case-singular> [plural-kebab] [--paginated] [--force]',
  );
  process.exit(1);
}

// --- Parseo de argumentos -------------------------------------------------
const rawArgs = process.argv.slice(2);
const flags = new Set(rawArgs.filter((a) => a.startsWith('--')));
const positionals = rawArgs.filter((a) => !a.startsWith('--'));

const paginated = flags.has('--paginated');
const force = flags.has('--force');

const unknownFlag = [...flags].find(
  (f) => f !== '--paginated' && f !== '--force',
);
if (unknownFlag) usage(`flag desconocido: ${unknownFlag}`);

const singularKebab = positionals[0];
const pluralOverride = positionals[1];

if (!singularKebab) usage('falta el nombre del dominio.');

const KEBAB_RE = /^[a-z][a-z0-9]*(-[a-z0-9]+)*$/;
if (!KEBAB_RE.test(singularKebab)) {
  usage(
    `"${singularKebab}" no es kebab-case válido (ej. "promotion", "payment-method").`,
  );
}
if (pluralOverride && !KEBAB_RE.test(pluralOverride)) {
  usage(`el plural "${pluralOverride}" no es kebab-case válido.`);
}

// --- Derivación de nombres ------------------------------------------------
// Pluralización simple: "es" si termina en s/x/z/ch/sh, "ies" si termina en consonante+y,
// "s" en el resto. Cualquier caso irregular se resuelve pasando el plural explícito como 2º arg.
function pluralizeKebab(word) {
  if (/(s|x|z|ch|sh)$/.test(word)) return `${word}es`;
  if (/[^aeiou]y$/.test(word)) return `${word.slice(0, -1)}ies`;
  return `${word}s`;
}

function kebabToPascal(kebab) {
  return kebab
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}

function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

const pluralKebab = pluralOverride ?? pluralizeKebab(singularKebab);

const PascalSingular = kebabToPascal(singularKebab); // Widget / PaymentMethod
const PascalPlural = kebabToPascal(pluralKebab); // Widgets / PaymentMethods
const SCREAMING_PLURAL = pluralKebab.replace(/-/g, '_').toUpperCase(); // WIDGETS
const humanSingular = singularKebab.replace(/-/g, ' '); // "payment method"
const humanPlural = pluralKebab.replace(/-/g, ' '); // "payment methods"
const HumanSingular = capitalize(humanSingular); // "Payment method"
const HumanPlural = capitalize(humanPlural); // "Payment methods"

const TODAY = new Date().toISOString().slice(0, 10);

const FEATURE_DIR = `${ROOT}src/features/${pluralKebab}`;
const PAGE_FILE = `${ROOT}src/app/admin/${pluralKebab}/page.tsx`;

function header(extra) {
  return (
    `// Generado por scripts/generate-feature.mjs el ${TODAY} — personalizá libremente.\n` +
    `// Esto NO es un archivo generado que se re-sobreescriba (a diferencia de types.generated.ts /\n` +
    `// theme.generated.css): es un punto de partida editable.${extra ? `\n${extra}` : ''}\n`
  );
}

// --- Templates ------------------------------------------------------------
function apiTemplate() {
  const listBlock = paginated
    ? `interface ${PascalPlural}ListPlaceholder {
  data: ${PascalSingular}[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export type ${PascalPlural}ListResponse = SchemaOr<
  '${PascalPlural}ListResponseDTO',
  ${PascalPlural}ListPlaceholder
>;

export interface Get${PascalPlural}Params {
  page: number;
  pageSize: number;
}

export function get${PascalPlural}({
  page,
  pageSize,
}: Get${PascalPlural}Params): Promise<${PascalPlural}ListResponse> {
  const query = new URLSearchParams({
    page: String(page),
    pageSize: String(pageSize),
  });
  return apiFetch<${PascalPlural}ListResponse>(\`${pluralKebab}?\${query.toString()}\`);
}`
    : `export function get${PascalPlural}(): Promise<${PascalSingular}[]> {
  return apiFetch<${PascalSingular}[]>('${pluralKebab}');
}`;

  return `${header()}import { apiFetch } from '@/core/api-client/client';
import type { components } from '@/core/api-client/types.generated';

// ⚠️ Estos tipos apuntan a los DTOs generados del backend (types.generated.ts). Confirmá que los
// nombres ('${PascalSingular}DetailResponseDTO' / 'Create${PascalSingular}Dto' / 'Update${PascalSingular}Dto'${
    paginated ? ` / '${PascalPlural}ListResponseDTO'` : ''
  })
// existan realmente ahí (corré \`pnpm generate:api-types\` primero); si el backend usa otro nombre,
// ajustá la clave. El helper SchemaOr<K, Fallback> resuelve al DTO real cuando la clave existe y,
// si todavía no existe, cae al placeholder de ejemplo (name/description) para que este esqueleto
// compile igual — reemplazá los placeholders por los campos reales una vez confirmados.
type SchemaOr<K extends string, Fallback> = K extends keyof components['schemas']
  ? components['schemas'][K]
  : Fallback;

interface ${PascalSingular}Placeholder {
  id: number;
  name: string;
  description: string | null;
}

interface Create${PascalSingular}Placeholder {
  name: string;
  description?: string;
}

export type ${PascalSingular} = SchemaOr<
  '${PascalSingular}DetailResponseDTO',
  ${PascalSingular}Placeholder
>;
export type Create${PascalSingular}Dto = SchemaOr<
  'Create${PascalSingular}Dto',
  Create${PascalSingular}Placeholder
>;
export type Update${PascalSingular}Dto = SchemaOr<
  'Update${PascalSingular}Dto',
  Partial<Create${PascalSingular}Placeholder>
>;

${listBlock}

export function create${PascalSingular}(dto: Create${PascalSingular}Dto): Promise<${PascalSingular}> {
  return apiFetch<${PascalSingular}>('${pluralKebab}', {
    method: 'POST',
    body: JSON.stringify(dto),
  });
}

export function update${PascalSingular}(
  id: number,
  dto: Update${PascalSingular}Dto,
): Promise<${PascalSingular}> {
  return apiFetch<${PascalSingular}>(\`${pluralKebab}/\${id}\`, {
    method: 'PATCH',
    body: JSON.stringify(dto),
  });
}

export function delete${PascalSingular}(id: number): Promise<void> {
  return apiFetch<void>(\`${pluralKebab}/\${id}\`, { method: 'DELETE' });
}
`;
}

function hooksTemplate() {
  const queryImports = paginated
    ? `import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';`
    : `import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';`;

  const apiImports = paginated
    ? `import {
  create${PascalSingular},
  delete${PascalSingular},
  get${PascalPlural},
  update${PascalSingular},
  type Create${PascalSingular}Dto,
  type Get${PascalPlural}Params,
  type Update${PascalSingular}Dto,
} from './api';`
    : `import {
  create${PascalSingular},
  delete${PascalSingular},
  get${PascalPlural},
  update${PascalSingular},
  type Create${PascalSingular}Dto,
  type Update${PascalSingular}Dto,
} from './api';`;

  const queryHook = paginated
    ? `export function use${PascalPlural}Query(params: Get${PascalPlural}Params) {
  return useQuery({
    queryKey: [...${SCREAMING_PLURAL}_QUERY_KEY, params],
    queryFn: () => get${PascalPlural}(params),
    placeholderData: keepPreviousData,
  });
}`
    : `export function use${PascalPlural}Query() {
  return useQuery({
    queryKey: ${SCREAMING_PLURAL}_QUERY_KEY,
    queryFn: get${PascalPlural},
  });
}`;

  return `'use client';

${header('// Nota: la copy usa género masculino por defecto ("creado"/"Nuevo"). Ajustá si la entidad es femenina.')}${queryImports}
import { toast } from 'sonner';
import { ApiError } from '@/core/api-client/errors';
${apiImports}

export const ${SCREAMING_PLURAL}_QUERY_KEY = ['${pluralKebab}'];

function getErrorMessage(error: unknown, fallback: string): string {
  return error instanceof ApiError ? error.message : fallback;
}

${queryHook}

export function useCreate${PascalSingular}Mutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: Create${PascalSingular}Dto) => create${PascalSingular}(dto),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ${SCREAMING_PLURAL}_QUERY_KEY });
      toast.success('${HumanSingular} creado correctamente.');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'No se pudo crear el ${humanSingular}.'));
    },
  });
}

export interface Update${PascalSingular}Variables {
  id: number;
  dto: Update${PascalSingular}Dto;
}

export function useUpdate${PascalSingular}Mutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: Update${PascalSingular}Variables) =>
      update${PascalSingular}(id, dto),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ${SCREAMING_PLURAL}_QUERY_KEY });
      toast.success('${HumanSingular} actualizado correctamente.');
    },
    onError: (error) => {
      toast.error(
        getErrorMessage(error, 'No se pudo actualizar el ${humanSingular}.'),
      );
    },
  });
}

export function useDelete${PascalSingular}Mutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => delete${PascalSingular}(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ${SCREAMING_PLURAL}_QUERY_KEY });
      toast.success('${HumanSingular} eliminado correctamente.');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'No se pudo eliminar el ${humanSingular}.'));
    },
  });
}
`;
}

function schemasTemplate() {
  return `${header()}import { z } from 'zod';

// Esquema del formulario: cubre solo los campos editables en el diálogo (no necesariamente todo el
// DTO). Ajustá/expandí según los campos reales de la entidad (numéricos, fechas, selects, etc.).
export const ${camelize(singularKebab)}FormSchema = z.object({
  name: z.string().min(1, 'El nombre es obligatorio'),
  description: z.string().optional(),
});

export type ${PascalSingular}FormValues = z.infer<typeof ${camelize(singularKebab)}FormSchema>;
`;
}

function camelize(kebab) {
  const pascal = kebabToPascal(kebab);
  return pascal.charAt(0).toLowerCase() + pascal.slice(1);
}

function tableTemplate() {
  const dataAccess = paginated ? 'data.data' : 'data';
  const queryCall = paginated
    ? `const [page, setPage] = useState(1);
  const { data, isPending, isError } = use${PascalPlural}Query({
    page,
    pageSize: PAGE_SIZE,
  });`
    : `const { data, isPending, isError } = use${PascalPlural}Query();`;

  const paginationProp = paginated
    ? `
        pagination={{
          page: data.pagination.page,
          totalPages: data.pagination.totalPages,
          onPageChange: setPage,
        }}`
    : '';

  const pageSizeConst = paginated ? `\nconst PAGE_SIZE = 10;\n` : '';

  return `'use client';

${header()}import type { ColumnDef } from '@tanstack/react-table';
import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/layout/data-table';
import { Skeleton } from '@/components/ui/skeleton';
import type { ${PascalSingular} } from '../api';
import { use${PascalPlural}Query, useDelete${PascalSingular}Mutation } from '../hooks';
import { ${PascalSingular}FormDialog } from './${singularKebab}-form-dialog';
${pageSizeConst}
export function ${PascalPlural}Table() {
  ${queryCall}
  const deleteMutation = useDelete${PascalSingular}Mutation();
  const [editing${PascalSingular}, setEditing${PascalSingular}] =
    useState<${PascalSingular} | null>(null);
  const [deleting${PascalSingular}, setDeleting${PascalSingular}] =
    useState<${PascalSingular} | null>(null);

  const columns: ColumnDef<${PascalSingular}, unknown>[] = [
    {
      accessorKey: 'name',
      header: 'Nombre',
    },
    {
      accessorKey: 'description',
      header: 'Descripción',
      cell: ({ row }) => (
        <span className="text-muted-foreground">
          {row.original.description ?? '—'}
        </span>
      ),
    },
    {
      id: 'actions',
      header: 'Acciones',
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setEditing${PascalSingular}(row.original)}
          >
            Editar
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setDeleting${PascalSingular}(row.original)}
          >
            Eliminar
          </Button>
        </div>
      ),
    },
  ];

  if (isPending) {
    return <Skeleton className="h-64" />;
  }

  if (isError) {
    return (
      <p className="text-muted-foreground">
        No se pudo cargar la lista de ${humanPlural}. Intentá recargar la página.
      </p>
    );
  }

  return (
    <>
      <DataTable
        columns={columns}
        data={${dataAccess}}
        emptyMessage="No hay ${humanPlural} para mostrar"${paginationProp}
      />

      <${PascalSingular}FormDialog
        open={!!editing${PascalSingular}}
        onOpenChange={(open) => {
          if (!open) setEditing${PascalSingular}(null);
        }}
        ${camelize(singularKebab)}={editing${PascalSingular} ?? undefined}
      />

      <AlertDialog
        open={!!deleting${PascalSingular}}
        onOpenChange={(open) => {
          if (!open) setDeleting${PascalSingular}(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar ${humanSingular}</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará permanentemente el ${humanSingular} &quot;
              {deleting${PascalSingular}?.name}&quot;. No se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={deleteMutation.isPending}
              onClick={() => {
                if (!deleting${PascalSingular}) return;
                deleteMutation.mutate(deleting${PascalSingular}.id, {
                  onSuccess: () => setDeleting${PascalSingular}(null),
                });
              }}
            >
              {deleteMutation.isPending ? 'Eliminando...' : 'Eliminar'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
`;
}

function formDialogTemplate() {
  const camel = camelize(singularKebab);
  return `'use client';

${header()}import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ApiError } from '@/core/api-client/errors';
import type { ${PascalSingular}, Create${PascalSingular}Dto } from '../api';
import {
  useCreate${PascalSingular}Mutation,
  useUpdate${PascalSingular}Mutation,
} from '../hooks';
import { ${camel}FormSchema, type ${PascalSingular}FormValues } from '../schemas';

interface ${PascalSingular}FormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ${camel}?: ${PascalSingular};
}

function buildDefaultValues(${camel}?: ${PascalSingular}): ${PascalSingular}FormValues {
  return {
    name: ${camel}?.name ?? '',
    description: ${camel}?.description ?? '',
  };
}

function buildPayload(values: ${PascalSingular}FormValues): Create${PascalSingular}Dto {
  return {
    name: values.name,
    description: values.description || undefined,
  };
}

export function ${PascalSingular}FormDialog({
  open,
  onOpenChange,
  ${camel},
}: ${PascalSingular}FormDialogProps) {
  const isEditing = !!${camel};
  const createMutation = useCreate${PascalSingular}Mutation();
  const updateMutation = useUpdate${PascalSingular}Mutation();
  const mutation = isEditing ? updateMutation : createMutation;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: standardSchemaResolver(${camel}FormSchema),
    defaultValues: buildDefaultValues(${camel}),
  });

  useEffect(() => {
    if (open) {
      reset(buildDefaultValues(${camel}));
    }
  }, [open, ${camel}, reset]);

  function onSubmit(values: ${PascalSingular}FormValues) {
    const payload = buildPayload(values);
    if (${camel}) {
      updateMutation.mutate(
        { id: ${camel}.id, dto: payload },
        { onSuccess: () => onOpenChange(false) },
      );
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => onOpenChange(false),
      });
    }
  }

  const errorMessage =
    mutation.error instanceof ApiError
      ? mutation.error.message
      : mutation.error
        ? 'Ocurrió un error inesperado. Intentá de nuevo.'
        : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form
          onSubmit={(event) => void handleSubmit(onSubmit)(event)}
          className="flex flex-col gap-4"
          noValidate
        >
          <DialogHeader>
            <DialogTitle>
              {isEditing ? 'Editar ${humanSingular}' : 'Nuevo ${humanSingular}'}
            </DialogTitle>
            <DialogDescription>
              {isEditing
                ? 'Modificá los datos del ${humanSingular} seleccionado.'
                : 'Completá los datos para crear un nuevo ${humanSingular}.'}
            </DialogDescription>
          </DialogHeader>

          {errorMessage && (
            <p className="text-destructive text-sm">{errorMessage}</p>
          )}

          <div className="flex flex-col gap-2">
            <Label htmlFor="name">Nombre</Label>
            <Input
              id="name"
              aria-invalid={!!errors.name}
              {...register('name')}
            />
            {errors.name && (
              <p className="text-destructive text-sm">{errors.name.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea id="description" {...register('description')} />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending
                ? 'Guardando...'
                : isEditing
                  ? 'Guardar cambios'
                  : 'Crear ${humanSingular}'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
`;
}

function newButtonTemplate() {
  return `'use client';

${header()}import { PlusIcon } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ${PascalSingular}FormDialog } from './${singularKebab}-form-dialog';

export function New${PascalSingular}Button() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <PlusIcon />
        Nuevo ${humanSingular}
      </Button>
      <${PascalSingular}FormDialog open={open} onOpenChange={setOpen} />
    </>
  );
}
`;
}

function pageTemplate() {
  return `${header()}import { ${PascalPlural}Table } from '@/features/${pluralKebab}/components/${pluralKebab}-table';
import { New${PascalSingular}Button } from '@/features/${pluralKebab}/components/new-${singularKebab}-button';

export default function ${PascalPlural}Page() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-semibold tracking-tight">
            ${HumanPlural}
          </h1>
          <p className="text-muted-foreground">Gestión de ${humanPlural}.</p>
        </div>
        <New${PascalSingular}Button />
      </div>
      <${PascalPlural}Table />
    </div>
  );
}
`;
}

// --- Escritura ------------------------------------------------------------
async function pathExists(p) {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
}

const files = [
  { path: `${FEATURE_DIR}/api.ts`, content: apiTemplate() },
  { path: `${FEATURE_DIR}/hooks.ts`, content: hooksTemplate() },
  { path: `${FEATURE_DIR}/schemas.ts`, content: schemasTemplate() },
  {
    path: `${FEATURE_DIR}/components/${pluralKebab}-table.tsx`,
    content: tableTemplate(),
  },
  {
    path: `${FEATURE_DIR}/components/${singularKebab}-form-dialog.tsx`,
    content: formDialogTemplate(),
  },
  {
    path: `${FEATURE_DIR}/components/new-${singularKebab}-button.tsx`,
    content: newButtonTemplate(),
  },
  { path: PAGE_FILE, content: pageTemplate() },
];

if (!force) {
  for (const { path } of files) {
    if (await pathExists(path)) {
      console.error(
        `Error: ya existe "${path.replace(ROOT, '')}".\n` +
          'Abortando para no sobreescribir. Usá --force para regenerar intencionalmente.',
      );
      process.exit(1);
    }
  }
}

for (const { path, content } of files) {
  await mkdir(dirname(path), { recursive: true });
  // Formatear con la config de prettier del repo para que el output salga idempotente (no lo
  // reformatee el hook de pre-commit ni `pnpm format`).
  const prettierConfig = await prettier.resolveConfig(path);
  const formatted = await prettier.format(content, {
    ...prettierConfig,
    filepath: path,
  });
  await writeFile(path, formatted);
  console.log(`  ✓ ${path.replace(ROOT, '')}`);
}

console.log(
  `\nFeature "${pluralKebab}" generada (${paginated ? 'paginada' : 'sin paginación'}).\n` +
    'Próximos pasos:\n' +
    '  1. pnpm generate:api-types  (para traer los DTOs reales del backend)\n' +
    `  2. Ajustá los campos de ejemplo (name/description) a los reales de "${PascalSingular}".\n` +
    '  3. Agregá los tests (.test.tsx) que exige el repo para cada componente/hook.\n' +
    '  4. pnpm lint && pnpm check:types',
);
