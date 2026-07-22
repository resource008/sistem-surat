import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

import { FormField, inputClass } from "../shared"

export function RegisterInfoPanel({ state, actions }: any) {
  return (
    <div className="w-full animate-in fade-in slide-in-from-top-2 duration-300">
      <div className="grid max-w-md gap-4 rounded-2xl border border-border/60 bg-background p-4 transition-all duration-200 hover:border-border hover:shadow-sm">
        <FormField label="Departemen">
          <Select value={state.deptId} onValueChange={actions.setDeptId}>
            <SelectTrigger className={cn(inputClass, "h-10 w-full rounded-xl shadow-none")}>
              <SelectValue placeholder="Pilih departemen" />
            </SelectTrigger>
            <SelectContent className="border-slate-200 dark:border-neutral-800 dark:bg-neutral-950">
              <SelectGroup>
                <SelectLabel className="px-2 py-2 leading-relaxed">
                  Pilih departemen untuk memuat struktur kolom surat.
                </SelectLabel>
                <SelectSeparator />
                {state.deptList.map((department: any) => (
                  <SelectItem
                    key={department.id}
                    value={department.id}
                    className="cursor-pointer text-[14px]"
                  >
                    {department.shortName}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </FormField>
      </div>
    </div>
  )
}
