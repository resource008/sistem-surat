import type { ReactNode } from "react"
import { ChevronDown } from "lucide-react"

type DepartemenSectionToggleProps = {
  icon: ReactNode
  title: string
  description: string
  open: boolean
  onClick: () => void
}

export function DepartemenSectionToggle({
  icon,
  title,
  description,
  open,
  onClick,
}: DepartemenSectionToggleProps) {
  return (
    <button
      type="button"
      className="flex min-h-[88px] w-full items-center justify-between gap-4 px-6 py-5 text-left"
      onClick={onClick}
    >
      <span className="flex min-w-0 items-center gap-4">
        <span className="flex size-6 shrink-0 items-center justify-center text-slate-950 dark:text-slate-50">
          {icon}
        </span>
        <span className="min-w-0">
          <span className="block text-[16px] font-bold leading-tight text-slate-950 dark:text-slate-50">
            {title}
          </span>
          <span className="mt-1.5 block text-sm leading-snug text-slate-900 dark:text-slate-200">
            {description}
          </span>
        </span>
      </span>
      <ChevronDown className={`size-5 shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
    </button>
  )
}
