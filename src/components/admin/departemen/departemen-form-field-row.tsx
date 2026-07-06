import type { ReactNode } from "react"
import { Label } from "@/components/ui/label"

type DepartemenFormFieldRowProps = {
  label: string
  tip?: ReactNode
  children: ReactNode
}

export function DepartemenFormFieldRow({
  label,
  tip,
  children,
}: DepartemenFormFieldRowProps) {
  return (
    <div className="grid gap-2 lg:grid-cols-[minmax(0,1fr)_minmax(260px,360px)] lg:items-center lg:gap-4">
      <Label className="flex items-center gap-2 text-sm font-medium">
        {label}
        {tip}
      </Label>
      {children}
    </div>
  )
}
