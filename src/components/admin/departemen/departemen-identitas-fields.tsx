import type { Dispatch, ElementType, SetStateAction } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { DepartemenFormState } from "@/types"
import { fieldClass } from "./departemen-form-config"

type DepartemenIdentitasFieldsProps = {
  form: DepartemenFormState
  disabled?: boolean
  onChange: Dispatch<SetStateAction<DepartemenFormState>>
  useLabelComponent?: boolean
  withPlaceholder?: boolean
}

export function DepartemenIdentitasFields({
  form,
  disabled,
  onChange,
  useLabelComponent = true,
  withPlaceholder = false,
}: DepartemenIdentitasFieldsProps) {
  const LabelTag: ElementType = useLabelComponent ? Label : "label"

  return (
    <div className="grid gap-x-20 gap-y-6 lg:grid-cols-2">
      <LabelTag className="grid gap-3 text-left text-[16px] font-medium text-slate-950 dark:text-slate-50">
        <span>Nama Departemen</span>
        <Input
          value={form.tujuan}
          onChange={(event) => onChange((current) => ({ ...current, tujuan: event.target.value }))}
          placeholder={withPlaceholder ? "Masukkan nama departemen" : undefined}
          className={fieldClass}
          disabled={disabled}
        />
      </LabelTag>
      <LabelTag className="grid gap-3 text-left text-[16px] font-medium text-slate-950 dark:text-slate-50">
        <span>Singkatan</span>
        <Input
          value={form.shortName}
          onChange={(event) => onChange((current) => ({ ...current, shortName: event.target.value }))}
          placeholder={withPlaceholder ? "Masukkan singkatan" : undefined}
          className={fieldClass}
          disabled={disabled}
        />
      </LabelTag>
    </div>
  )
}
