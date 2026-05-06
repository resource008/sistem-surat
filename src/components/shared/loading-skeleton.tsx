import { cn } from "@/lib/utils"

interface LoadingSpinnerProps {
  message?:  string
  className?: string
}

export function LoadingSpinner({
  message   = "Memuat data...",
  className,
}: LoadingSpinnerProps) {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center gap-3.5",
      className,
    )}>
      <svg
        width="32" height="32" viewBox="0 0 32 32"
        className="animate-spin"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx="16" cy="16" r="13"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          className="text-slate-200 dark:text-slate-700"
        />
        <path
          d="M16 3a13 13 0 0 1 13 13"
          stroke="#378ADD"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
      <p className="text-[13px] text-slate-500 dark:text-slate-400">
        {message}
      </p>
    </div>
  )
}