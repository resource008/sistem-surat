"use client"

import { useTambahDepartemen } from "@/hooks/use-tambah-departemen"
import { DepartemenFormFields } from "./departemen-form-fields"
import { DepartemenFormInfo } from "./departemen-form-info"
import { DepartemenFormActionBar } from "./departemen-form-action-bar"

export default function DepartemenAddPage() {
  const { state, actions } = useTambahDepartemen()

  return (
    <form onSubmit={actions.submit} className="flex flex-col gap-7 pb-32 [overflow-anchor:none]">
      <DepartemenFormInfo />
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
      />
    </form>
  )
}
