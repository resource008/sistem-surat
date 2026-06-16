"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { DepartemenFormState } from "@/types"

interface Props {
  form: DepartemenFormState
  disabled?: boolean
  onChange: React.Dispatch<React.SetStateAction<DepartemenFormState>>
  useLabelComponent?: boolean
}

export function DepartemenFormFields({
  form,
  disabled,
  onChange,
  useLabelComponent = true,
}: Props) {
  const LabelTag = useLabelComponent ? Label : "label"

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <LabelTag className="grid gap-1.5 text-sm font-medium sm:flex sm:flex-col">
        <span className="text-xs text-muted-foreground">Nama Departemen</span>
        <Input
          value={form.fullName}
          onChange={(e) => onChange((current) => ({ ...current, fullName: e.target.value }))}
          placeholder="Contoh: Human Resources"
          className="h-10 rounded-xl text-sm"
          disabled={disabled}
        />
      </LabelTag>
      <LabelTag className="grid gap-1.5 text-sm font-medium sm:flex sm:flex-col">
        <span className="text-xs text-muted-foreground">Singkatan</span>
        <Input
          value={form.shortName}
          onChange={(e) => onChange((current) => ({ ...current, shortName: e.target.value }))}
          placeholder="Contoh: HRD"
          className="h-10 rounded-xl text-sm"
          disabled={disabled}
        />
      </LabelTag>
    </div>
  )
}
