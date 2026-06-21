import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { DepartemenFormState } from "@/types"
import { fieldClass } from "./departemen-form-config"

type DepartemenModeKolomFieldProps = {
  value: DepartemenFormState["columnMode"]
  disabled?: boolean
  onChange: (value: DepartemenFormState["columnMode"]) => void
}

export function DepartemenModeKolomField({
  value,
  disabled,
  onChange,
}: DepartemenModeKolomFieldProps) {
  return (
    <div className="grid items-center gap-y-3 lg:grid-cols-[minmax(0,1fr)_360px]">
      <span className="text-[16px] font-medium text-slate-950 dark:text-slate-50">Tipe kolom</span>
      <Select
        value={value}
        onValueChange={(value) => onChange(value as DepartemenFormState["columnMode"])}
        disabled={disabled}
      >
        <SelectTrigger className={`${fieldClass} w-full`}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="new">Buat baru</SelectItem>
          <SelectItem value="existing">Gunakan yang sudah ada</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
