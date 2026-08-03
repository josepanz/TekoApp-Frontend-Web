'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { PERMISSIONS } from '@/core/auth/permissions';

interface PermissionLeaf {
  /** Ruta legible relativa a su grupo, ej. "PASSWORD.CREATE". */
  label: string;
  /** Valor real del permiso, ej. "user.password:create". */
  value: string;
}

interface PermissionGroup {
  name: string;
  leaves: PermissionLeaf[];
}

function collectLeaves(node: unknown, path: string[]): PermissionLeaf[] {
  if (typeof node === 'string') {
    return [{ label: path.join('.'), value: node }];
  }
  if (node && typeof node === 'object') {
    return Object.entries(node as Record<string, unknown>).flatMap(
      ([key, value]) => collectLeaves(value, [...path, key]),
    );
  }
  return [];
}

function buildGroups(): {
  groups: PermissionGroup[];
  loose: PermissionLeaf[];
} {
  const groups: PermissionGroup[] = [];
  const loose: PermissionLeaf[] = [];

  Object.entries(PERMISSIONS).forEach(([groupName, value]) => {
    if (typeof value === 'string') {
      loose.push({ label: groupName, value });
    } else {
      groups.push({ name: groupName, leaves: collectLeaves(value, []) });
    }
  });

  return { groups, loose };
}

const { groups: PERMISSION_GROUPS, loose: LOOSE_PERMISSIONS } = buildGroups();

interface PermissionsPickerProps {
  value: string[];
  onChange: (value: string[]) => void;
}

// Arma el selector de permisos a partir de `PERMISSIONS` (espejo del enum del backend en
// core/auth/permissions.ts) -- cada grupo (USER, ROLE, MERCHANT, etc.) se muestra como una
// sección con sus valores hoja como checkboxes; los valores string sueltos (ej. DASHBOARD) se
// muestran como checkboxes sin agrupar.
export function PermissionsPicker({ value, onChange }: PermissionsPickerProps) {
  function toggle(permission: string, checked: boolean) {
    if (checked) {
      if (!value.includes(permission)) {
        onChange([...value, permission]);
      }
      return;
    }
    onChange(value.filter((item) => item !== permission));
  }

  return (
    <div className="flex flex-col gap-4">
      {LOOSE_PERMISSIONS.length > 0 && (
        <div className="flex flex-col gap-2 rounded-md border p-3">
          {LOOSE_PERMISSIONS.map((leaf) => (
            <PermissionCheckboxItem
              key={leaf.value}
              leaf={leaf}
              checked={value.includes(leaf.value)}
              onToggle={toggle}
            />
          ))}
        </div>
      )}

      {PERMISSION_GROUPS.map((group) => (
        <div
          key={group.name}
          className="flex flex-col gap-2 rounded-md border p-3"
        >
          <span className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
            {group.name}
          </span>
          <div className="flex flex-col gap-2">
            {group.leaves.map((leaf) => (
              <PermissionCheckboxItem
                key={leaf.value}
                leaf={leaf}
                checked={value.includes(leaf.value)}
                onToggle={toggle}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

interface PermissionCheckboxItemProps {
  leaf: PermissionLeaf;
  checked: boolean;
  onToggle: (permission: string, checked: boolean) => void;
}

function PermissionCheckboxItem({
  leaf,
  checked,
  onToggle,
}: PermissionCheckboxItemProps) {
  const id = `permission-${leaf.value}`;
  return (
    <div className="flex items-center gap-2">
      <Checkbox
        id={id}
        checked={checked}
        onCheckedChange={(next) => onToggle(leaf.value, next)}
      />
      <Label htmlFor={id} className="font-normal">
        {leaf.label}
      </Label>
    </div>
  );
}
