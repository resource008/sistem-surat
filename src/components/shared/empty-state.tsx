// Generic empty-state — bisa dipakai di seluruh aplikasi

import { cn }             from "@/lib/utils"
import type { ReactNode, ElementType }  from "react" // Gunakan ElementType

// Tambahkan 'export' agar tipe props ini bisa dikenali penuh oleh TS
export interface EmptyStateProps {
  /** Icon utama di tengah kotak */
  icon:        ElementType
  /** Icon kecil di sudut kanan-bawah (opsional) */
  badgeIcon?:  ElementType
  title:       string
  description: ReactNode
  /** Tombol / elemen aksi (opsional) */
  action?:     ReactNode
  className?:  string
}

export function EmptyState({
  icon:      Icon,
  badgeIcon: BadgeIcon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn(
      "empty-state-viewport flex flex-col items-center justify-center gap-5 px-4",
      className,
    )}>
      {/* Icon container */}
      <div className="relative flex items-center justify-center
        h-24 w-24 rounded-3xl
        bg-slate-100 dark:bg-slate-800/60
        ring-1 ring-slate-200 dark:ring-slate-700">

        <Icon
          strokeWidth={1.25}
          className="h-11 w-11 text-slate-400 dark:text-slate-500"
        />

        {BadgeIcon && (
          <span className="absolute -bottom-2.5 -right-2.5
            flex items-center justify-center
            h-8 w-8 rounded-full
            bg-white dark:bg-slate-900
            ring-1 ring-slate-200 dark:ring-slate-700 shadow-sm">
            <BadgeIcon className="h-4 w-4 text-slate-400 dark:text-slate-500" />
          </span>
        )}
      </div>

      {/* Text */}
      <div className="text-center space-y-1.5 max-w-xs">
        <p className="text-[14px] font-semibold text-slate-700 dark:text-slate-200">
          {title}
        </p>
        <div className="text-[12.5px] leading-relaxed text-slate-400 dark:text-slate-500">
          {description}
        </div>
      </div>

      {/* Action */}
      {action}
    </div>
  )
}
