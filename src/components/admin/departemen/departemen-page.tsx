"use client"

import { useRouter } from "next/navigation"
import { useDepartemenList } from "@/hooks/use-departemen-list"
import type { Departemen } from "@/types"
import { DepartemenAddFab } from "./departemen-add-fab"
import { DepartemenDeleteDialog } from "./departemen-delete-dialog"
import { DepartemenMobileList } from "./departemen-mobile-list"
import { DepartemenTable } from "./departemen-table"

export default function DepartemenPage() {
  const router = useRouter()
  const { state, actions } = useDepartemenList()
  const openEditPage = (departemen: Departemen) => {
    router.push(`/admin/departemen/${encodeURIComponent(departemen.id)}/edit`)
  }

  return (
    <div className="flex flex-col gap-4 pb-24">
      <DepartemenTable
        departments={state.departments}
        error={state.error}
        isLoading={state.isLoading}
        onEdit={openEditPage}
        onDelete={actions.setDeleting}
      />

      <DepartemenMobileList
        departments={state.departments}
        error={state.error}
        isLoading={state.isLoading}
        onEdit={openEditPage}
        onDelete={actions.setDeleting}
      />

      <DepartemenDeleteDialog
        departemen={state.deleting}
        deletingId={state.deletingId}
        onOpenChange={(open) => !open && actions.setDeleting(null)}
        onDelete={actions.deleteDepartemen}
      />

      <DepartemenAddFab onClick={() => router.push("/admin/departemen/add")} />
    </div>
  )
}
