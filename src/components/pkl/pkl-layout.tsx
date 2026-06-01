"use client"

import { RoleLayout } from "@/components/role-dashboard/role-layout"

interface Props {
  children: React.ReactNode
}

export function PklLayout({ children }: Props) {
  return <RoleLayout role="PKL">{children}</RoleLayout>
}
