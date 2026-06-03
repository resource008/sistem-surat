"use client"

import { ShieldOff } from "lucide-react"

interface PermissionDeniedProps {
  feature?: string
}

export function PermissionDenied({ feature = "fitur ini" }: PermissionDeniedProps) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="flex flex-col items-center gap-4 text-center max-w-sm">

        {/* Icon */}
        <div className="relative flex items-center justify-center">
          <div className="size-20 rounded-2xl bg-muted/40 flex items-center justify-center">
            <ShieldOff size={36} className="text-muted-foreground/50" />
          </div>
        </div>

        {/* Text */}
        <div className="flex flex-col gap-1.5">
          <p className="text-sm font-semibold text-foreground">
            Akses Ditolak
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Anda tidak memiliki izin untuk mengakses{" "}
            <span className="font-medium text-foreground">{feature}</span>.
            Hubungi administrator untuk mendapatkan akses.
          </p>
        </div>

      </div>
    </div>
  )
}