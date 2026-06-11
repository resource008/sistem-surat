"use client"

import { Loader2 } from "lucide-react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useEditDepartemen } from "@/hooks/use-edit-departemen"
import { DepartemenFormFields } from "./departemen-form-fields"
import { DepartemenFormInfo } from "./departemen-form-info"
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
    <form onSubmit={actions.submit} className="flex flex-col gap-4 pb-32">
      <div className="overflow-hidden rounded-2xl border border-border/50 bg-background">
        <div className="flex flex-col gap-5 px-6 py-6">
          <DepartemenFormInfo />
          <DepartemenFormFields
            form={state.form}
            onChange={actions.setForm}
            disabled={state.saving}
          />
        </div>
      </div>

      <DepartemenFormActionBar
        saving={state.saving}
        onCancel={actions.cancel}
      />
    </form>
  )
}
