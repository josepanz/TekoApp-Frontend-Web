import { AdminSectionGate } from '@/components/layout/admin-section-gate';

export default function Layout({ children }: { children: React.ReactNode }) {
  return <AdminSectionGate section="locations">{children}</AdminSectionGate>;
}
