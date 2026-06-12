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
      toast.success("Berhasil keluar")
      window.history.replaceState({}, "", "/login")
    }
  }, [searchParams])

  return null
}
