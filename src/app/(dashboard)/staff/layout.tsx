import { RoleLayout } from "@/components/role-dashboard/role-layout"

export default function Layout({ children }: { children: React.ReactNode }) {
  return <RoleLayout role="STAFF">{children}</RoleLayout>
}
