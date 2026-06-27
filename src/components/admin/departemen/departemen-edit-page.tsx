"use client"

import { useState } from "react"
import { Info } from "lucide-react"
import { useParams } from "next/navigation"
import { LoadingSkeleton } from "@/components/shared/loading-skeleton"
import { Button } from "@/components/ui/button"
import { useEditDepartemen } from "@/hooks/use-edit-departemen"
import { DepartemenEditFormFields } from "./departemen-edit-form-fields"
import { DepartemenFormActionBar } from "./departemen-form-action-bar"
import { DepartemenFormInfo } from "./departemen-form-info"

export default function DepartemenEditPage() {
  const { id } = useParams<{ id: string }>()
  const { state, actions } = useEditDepartemen(id)
  const [helpOpen, setHelpOpen] = useState(false)

  if (state.loading) {
    return (
      <LoadingSkeleton type="departemen-form" />
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
    <form onSubmit={actions.submit} className="flex flex-col gap-4 pb-28 [overflow-anchor:none]">
      <DepartemenFormInfo open={helpOpen} onOpenChange={setHelpOpen} />
      <DepartemenEditFormFields
        form={state.form}
        departments={state.departments}
        onChange={actions.setForm}
        disabled={state.saving}
      />

      <DepartemenFormActionBar
        saving={state.saving}
        onCancel={actions.cancel}
        secondaryAction={{
          icon: <Info size={14} />,
          label: "Bantuan",
          onClick: () => setHelpOpen(true),
        }}
      />
    </form>
  )
}
