interface FieldProps {
  label: string
  value: string
  mono?: boolean
  icon?: React.ReactNode
  fullWidth?: boolean
}

export function Field({ label, value, mono = false, icon, fullWidth = false }: FieldProps) {
  return (
    <div className={fullWidth ? "col-span-2" : ""}>
      <p className="flex items-center gap-1.5 text-[10px] font-semibold
                    text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5">
        {icon}<span>{label}</span>
      </p>
      <div className={[
        "w-full px-3.5 py-2.5 rounded-xl",
        "border border-slate-200 dark:border-slate-800",
        "bg-slate-50/70 dark:bg-slate-900/50",
        "text-[13px] text-slate-700 dark:text-slate-300",
        mono ? "font-mono text-[12px] tracking-wide" : "font-medium",
      ].join(" ")}>
        {value}
      </div>
    </div>
  )
}