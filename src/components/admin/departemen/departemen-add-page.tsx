"use client"

import { useTambahDepartemen } from "@/hooks/use-tambah-departemen"
import { DepartemenFormFields } from "./departemen-form-fields"
import { DepartemenFormInfo } from "./departemen-form-info"
import { DepartemenFormActionBar } from "./departemen-form-action-bar"

export default function DepartemenAddPage() {
  const { state, actions } = useTambahDepartemen()

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
