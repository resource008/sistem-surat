import type { Role } from "@/types"

export type DashboardRole = Extract<Role, "STAFF" | "PKL">
