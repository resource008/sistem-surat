import type { Role } from "@/types"

export type DashboardRole = Extract<Role, "STAFF" | "PKL">

export type RoleTopbarFilters = {
  date: string | null
  departments: string[]
}
