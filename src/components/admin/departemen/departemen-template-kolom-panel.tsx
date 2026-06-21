import { List } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Departemen } from "@/types"
import { fieldClass, panelClass } from "./departemen-form-config"

type DepartemenTemplateKolomPanelProps = {
  departments: Departemen[]
  value: string
  disabled?: boolean
  onChange: (departmentId: string) => void
}

export function DepartemenTemplateKolomPanel({
  departments,
  value,
  disabled,
  onChange,
}: DepartemenTemplateKolomPanelProps) {
  return (
    <div className={`${panelClass} px-6 py-5`}>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end">
        <div>
          <div className="flex items-start gap-5">
            <List className="mt-1 size-6 shrink-0 text-slate-950 dark:text-slate-50" />
            <div className="min-w-0">
              <h3 className="text-[17px] font-bold leading-tight">Pilih departemen</h3>
              <p className="mt-3 text-[15px] leading-snug text-slate-950 dark:text-slate-100">
                Silahkan pilih departemen dengan kolom yang ada
              </p>
            </div>
          </div>
          <span className="mt-6 block text-[16px] font-medium">Pilih departemen</span>
        </div>
        <Select
          value={value}
          onValueChange={onChange}
          disabled={disabled || departments.length === 0}
        >
          <SelectTrigger className={`${fieldClass} w-full`}>
            <SelectValue placeholder="Pilih departemen" />
          </SelectTrigger>
          <SelectContent>
            {departments.map((department) => (
              <SelectItem key={department.id} value={department.id}>
                {department.shortName} - {department.tujuan}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
