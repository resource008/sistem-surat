import type { UserPermissions, UserRole } from "@/domain/user/types"

export const USER_ROLE_LABEL: Record<string, string> = {
  ADMIN: "Admin",
  STAFF: "Staff",
  PKL: "PKL",
}

type UserPermissionLabel = {
  key: keyof UserPermissions
  label: string
  group?: string
  parent?: boolean
}

export const USER_PERMISSION_LABELS: readonly UserPermissionLabel[] = [
  { key: "canViewDataSurat", label: "Data Surat", group: "Data Surat", parent: true },
  { key: "canCreate", label: "Tambah Surat", group: "Data Surat" },
  { key: "canEdit", label: "Edit Surat", group: "Data Surat" },
  { key: "canDelete", label: "Hapus Surat", group: "Data Surat" },
  { key: "canPrint", label: "Cetak Surat" },
  { key: "canTrack", label: "Track Surat" },
] as const

export const USER_PERMISSION_GROUPS = [
  {
    label: "Data Surat",
    items: USER_PERMISSION_LABELS.filter((permission) => permission.group === "Data Surat"),
  },
  {
    label: null,
    items: USER_PERMISSION_LABELS.filter((permission) => !permission.group),
  },
] as const
