"use client"

import { useSearchParams } from "next/navigation"
import { useEffect, useRef } from "react"
import { toast } from "sonner"

export function LogoutNotifier() {
  const searchParams = useSearchParams()
  const didRun = useRef(false)

  useEffect(() => {
    if (didRun.current) return
    didRun.current = true

    if (searchParams.get("logout") === "true") {
      if (searchParams.get("reason") === "idle") {
        toast.info("Sesi berakhir", {
          description: "Tidak ada aktivitas selama 30 menit. Silakan login ulang.",
        })
      } else {
        toast.success("Berhasil keluar")
      }
      window.history.replaceState({}, "", "/login")
    }
  }, [searchParams])

  return null
}
