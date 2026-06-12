import type { UserPermissions } from "@/domain/user/types"
import type { DashboardRole } from "@/components/role-dashboard/types"

export type PermissionKey = keyof UserPermissions

export const ROLE_FEATURE_LABEL: Record<PermissionKey, string> = {
  canPrint: "Cetak Surat",
  canCreate: "Tambah Data Surat",
  canEdit: "Edit Data Surat",
  canDelete: "Hapus Data Surat",
  canTrack: "Lacak Surat",
}

export function getRoleBasePath(role: DashboardRole) {
  return `/${role.toLowerCase()}`
}

export function getRequiredPermission(
  pathname: string,
  basePath: string
): PermissionKey | null {
  if (pathname.startsWith(`${basePath}/cetak`)) return "canPrint"
  if (pathname.startsWith(`${basePath}/add`)) return "canCreate"
  if (pathname.includes(`${basePath}/`) && pathname.includes("/edit/")) return "canEdit"
  if (pathname.startsWith(`${basePath}/track`)) return "canTrack"
  return null
}

export function getRolePageTitle(pathname: string, basePath: string) {
  if (pathname.startsWith(`${basePath}/akun`)) return "Akun Anda"
  if (pathname.includes("/cetak")) return "Cetak"
  if (pathname.includes("/akun")) return "Akun Anda"
  if (pathname.includes("/data-surat")) return "Data Surat"
  if (pathname.includes("/track")) return "Track Surat"
  if (pathname.includes("/view/") || pathname.includes("/edit/")) return "Data Surat"
  return "Data Surat"
}
