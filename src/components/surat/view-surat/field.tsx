import { cn } from "@/lib/utils"

interface FieldProps {
  label: string
  value?: string
  placeholder?: string  // ← tambah ini
  fullWidth?: boolean
  mono?: boolean
}

export function Field({ label, value, placeholder = "Tidak diisi", fullWidth, mono }: FieldProps) {
  const isEmpty = !value

  return (
    <div className={fullWidth ? "col-span-full" : ""}>
      <p className="text-[12px] font-medium
                    text-slate-400 dark:text-slate-500 mb-1.5">
        {label}
      </p>
      <div className={cn(
        "rounded-xl border px-3.5 py-2.5 text-[14px] min-h-[38px]",
        "border-slate-200 dark:border-neutral-800",
        "bg-white dark:bg-neutral-950",
        mono && !isEmpty && "font-mono",
        isEmpty
          ? "text-slate-400 dark:text-slate-600 italic"   // ← styling placeholder
          : "text-slate-800 dark:text-slate-200",
      )}>
        {isEmpty ? placeholder : value}
      </div>
    </div>
  )
}
