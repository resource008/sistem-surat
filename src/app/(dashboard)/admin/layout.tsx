import { AdminLayout } from "@/components/admin/layout/admin-layout"

export default function Layout({ children }: { children: React.ReactNode }) {
  return <AdminLayout>{children}</AdminLayout>
}
