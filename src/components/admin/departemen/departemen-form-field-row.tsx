import type { ReactNode } from "react"

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
    <div className="grid items-center gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
      <span className="flex items-center gap-2 text-[15px] font-medium">
        {label}
        {tip}
      </span>
      {children}
    </div>
  )
}
