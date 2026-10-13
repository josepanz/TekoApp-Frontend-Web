import { AdminSectionGate } from '@/components/layout/admin-section-gate';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <AdminSectionGate section="rolesPermission">{children}</AdminSectionGate>
  );
}
