import DataSuratPage from "@/components/surat/data-surat/data-surat"
import EditSuratPage from "@/components/surat/edit-surat/edit-surat"
import TambahSuratPage from "@/components/surat/tambah-surat/tambah-surat"
import ViewSuratPage from "@/components/surat/view-surat/view-surat"
import type { Role } from "@/types"

type DashboardRole = Extract<Role, "STAFF" | "PKL">

function getBasePath(role: DashboardRole) {
  return `/${role.toLowerCase()}`
}

export function RoleDataSuratPage({ role }: { role: DashboardRole }) {
  const basePath = getBasePath(role)

  return (
    <DataSuratPage
      role={role}
      basePath={`${basePath}/data-surat`}
      printPath={`${basePath}/cetak`}
    />
  )
}

export function RoleTambahSuratPage({ role }: { role: DashboardRole }) {
  const basePath = getBasePath(role)

  return (
    <TambahSuratPage
      role={role}
      basePath={`${basePath}/data-surat`}
    />
  )
}

export function RoleEditSuratPage({ role }: { role: DashboardRole }) {
  const basePath = getBasePath(role)

  return (
    <EditSuratPage
      role={role}
      basePath={`${basePath}/data-surat`}
    />
  )
}

export function RoleViewSuratPage({ role }: { role: DashboardRole }) {
  const basePath = getBasePath(role)

  return (
    <ViewSuratPage
      role={role}
      basePath={`${basePath}/data-surat`}
    />
  )
}
