import DataSuratPage from "@/components/surat/data-surat/data-surat"
import EditSuratPage from "@/components/surat/edit-surat/edit-surat"
import TambahSuratPage from "@/components/surat/tambah-surat/tambah-surat"
import ViewSuratPage from "@/components/surat/view-surat/view-surat"
import type { DashboardRole } from "@/domain/user/types"
import { getRoleBasePath } from "@/lib/role-dashboard"

export function RoleDataSuratPage({ role }: { role: DashboardRole }) {
  const basePath = getRoleBasePath(role)

  return (
    <DataSuratPage
      role={role}
      basePath={`${basePath}/data-surat`}
      printPath={`${basePath}/cetak`}
    />
  )
}

export function RoleTambahSuratPage({ role }: { role: DashboardRole }) {
  const basePath = getRoleBasePath(role)

  return (
    <TambahSuratPage
      role={role}
      basePath={`${basePath}/data-surat`}
    />
  )
}

export function RoleEditSuratPage({ role }: { role: DashboardRole }) {
  const basePath = getRoleBasePath(role)

  return (
    <EditSuratPage
      role={role}
      basePath={`${basePath}/data-surat`}
    />
  )
}

export function RoleViewSuratPage({ role }: { role: DashboardRole }) {
  const basePath = getRoleBasePath(role)

  return (
    <ViewSuratPage
      role={role}
      basePath={`${basePath}/data-surat`}
    />
  )
}
