"use client"

import { useState } from "react"
import { Info } from "lucide-react"
import { useTambahDepartemen } from "@/hooks/use-tambah-departemen"
import { DepartemenFormFields } from "./departemen-form-fields"
import { DepartemenFormInfo } from "./departemen-form-info"
import { DepartemenFormActionBar } from "./departemen-form-action-bar"

export default function DepartemenAddPage() {
  const { state, actions } = useTambahDepartemen()
  const [helpOpen, setHelpOpen] = useState(false)

  return (
    <form onSubmit={actions.submit} className="flex flex-col gap-4 pb-28 [overflow-anchor:none]">
      <DepartemenFormInfo open={helpOpen} onOpenChange={setHelpOpen} />
      <DepartemenFormFields
        form={state.form}
        departments={state.departments}
        onChange={actions.setForm}
        disabled={state.saving}
        showColumnMode
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
