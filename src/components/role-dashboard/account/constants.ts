export const ROLE_LABEL: Record<string, string> = {
  ADMIN: "Admin",
  STAFF: "Staff",
  PKL: "PKL",
}

export const ACCOUNT_PERMISSIONS = [
  { key: "canCreate", label: "Tambah Data Surat" },
  { key: "canPrint", label: "Cetak Surat" },
  { key: "canEdit", label: "Edit Data Surat" },
  { key: "canTrack", label: "Lacak Surat" },
  { key: "canDelete", label: "Hapus Data Surat" },
] as const
