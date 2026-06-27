import type { UserPermissions, UserRole } from "@/domain/user/types"

export const USER_ROLE_LABEL: Record<UserRole, string> = {
  ADMIN: "Admin",
  STAFF: "Staff",
  PKL: "PKL",
}

export const USER_PERMISSION_LABELS = [
  { key: "canCreate", label: "Tambah Data Surat" },
  { key: "canPrint", label: "Cetak Surat" },
  { key: "canEdit", label: "Edit Data Surat" },
  { key: "canTrack", label: "Lacak Surat" },
  { key: "canDelete", label: "Hapus Data Surat" },
] as const satisfies readonly { key: keyof UserPermissions; label: string }[]
