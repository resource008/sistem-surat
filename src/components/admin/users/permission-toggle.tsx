import { Check, X } from "lucide-react"

type PermissionToggleProps = {
  value: boolean
  onChange: (value: boolean) => void
}

export function PermissionToggle({ value, onChange }: PermissionToggleProps) {
  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        onClick={() => onChange(false)}
        className={`flex h-8 w-8 items-center justify-center rounded-lg border transition-colors
          ${!value
            ? "border-slate-300 bg-slate-200 dark:border-slate-600 dark:bg-slate-700"
            : "border-slate-200 bg-transparent text-slate-400 dark:border-slate-800"}`}
      >
        <X size={14} />
      </button>
      <button
        type="button"
        onClick={() => onChange(true)}
        className={`flex h-8 w-8 items-center justify-center rounded-lg border transition-colors
          ${value
            ? "border-blue-600 bg-blue-600 text-white"
            : "border-slate-200 bg-transparent text-slate-400 dark:border-slate-800"}`}
      >
        <Check size={14} strokeWidth={3} />
      </button>
    </div>
  )
}
