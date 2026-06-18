"use client"

import { Loader2 } from "lucide-react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useEditDepartemen } from "@/hooks/use-edit-departemen"
import { DepartemenEditFormFields } from "./departemen-edit-form-fields"
import { DepartemenFormActionBar } from "./departemen-form-action-bar"

export default function DepartemenEditPage() {
  const { id } = useParams<{ id: string }>()
  const { state, actions } = useEditDepartemen(id)

  if (state.loading) {
    return (
      <div className="flex min-h-[360px] items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!state.departemen) {
    return (
      <div className="flex min-h-[360px] flex-col items-center justify-center gap-3">
        <p className="text-sm text-muted-foreground">Departemen tidak ditemukan</p>
        <Button variant="outline" onClick={actions.cancel}>
          Kembali
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={actions.submit} className="flex flex-col gap-4 pb-32 [overflow-anchor:none]">
      <DepartemenEditFormFields
        form={state.form}
        departments={state.departments}
        onChange={actions.setForm}
        disabled={state.saving}
      />

      <DepartemenFormActionBar
        saving={state.saving}
        onCancel={actions.cancel}
      />
    </form>
  )
}
