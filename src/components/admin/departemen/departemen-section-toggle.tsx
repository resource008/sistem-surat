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
      className="flex min-h-[84px] w-full items-center justify-between gap-4 border-b bg-card px-5 py-4 text-left transition-colors hover:bg-muted/40"
      onClick={onClick}
    >
      <span className="flex min-w-0 items-center gap-3">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-lg border bg-background text-muted-foreground">
          {icon}
        </span>
        <span className="min-w-0">
          <span className="block text-base font-medium leading-tight">
            {title}
          </span>
          <span className="mt-1 block text-sm leading-snug text-muted-foreground">
            {description}
          </span>
        </span>
      </span>
      <ChevronDown className={`size-4 shrink-0 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
    </button>
  )
}
