"use client"

import { useRouter } from "next/navigation"
import { useDepartemenList } from "@/hooks/use-departemen-list"
import type { Departemen } from "@/types"
import { DepartemenAddFab } from "./departemen-add-fab"
import { DepartemenTable } from "./departemen-table"

export default function DepartemenPage() {
  const router = useRouter()
  const { state, actions } = useDepartemenList()

  function openDetail(departemen: Departemen) {
    router.push(`/admin/departemen/${encodeURIComponent(departemen.shortName || departemen.id)}`)
  }

  return (
    <div className="flex flex-col gap-4 pb-24">
      <DepartemenTable
        departments={state.departments}
        error={state.error}
        isLoading={state.isLoading}
        visibilityId={state.visibilityId}
        onOpenDetail={openDetail}
        onToggleVisibility={actions.setDepartemenVisibility}
      />

      <DepartemenAddFab onClick={() => router.push("/admin/departemen/add")} />
    </div>
  )
}
