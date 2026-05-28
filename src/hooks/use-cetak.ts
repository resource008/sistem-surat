"use client"

import type { RegisterSurat } from "@/types/surat-types"
import { useEffect, useState } from "react"

const CETAK_IDS_KEY_ALL = "cetak:ids:all"
const CETAK_IDS_KEY_PI  = "cetak:ids:pi"

function isClient() { return typeof window !== "undefined" }

function getKey(mode: "all" | "pi") {
  return mode === "pi" ? CETAK_IDS_KEY_PI : CETAK_IDS_KEY_ALL
}

export function clearCetakSession(mode: "all" | "pi" = "all") {
  if (!isClient()) return
  try { sessionStorage.removeItem(getKey(mode)) } catch {}
}

export function getCetakIds(mode: "all" | "pi" = "all"): string {
  if (!isClient()) return ""
  try { return sessionStorage.getItem(getKey(mode)) ?? "" } catch { return "" }
}

interface UseCetakDataReturn {
  data    : RegisterSurat[]
  loading : boolean
  error   : string | null
}

export function useCetakData(idsParam: string, mode: "all" | "pi" = "all"): UseCetakDataReturn {
  const [data,    setData]    = useState<RegisterSurat[]>([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    const key = getKey(mode)
    let ids   = idsParam

    if (ids) {
      try { sessionStorage.setItem(key, ids) } catch {}
    } else {
      try { ids = sessionStorage.getItem(key) ?? "" } catch {}
    }

    window.dispatchEvent(new CustomEvent("cetak:ids-ready", {
      detail: { count: ids.split(",").filter(Boolean).length }
    }))

    if (!ids) {
      setData([])
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    const endpoint = mode === "pi" ? "/api/cetak/pi" : "/api/cetak/all"

    fetch(`${endpoint}?ids=${ids}`)
      .then(r => {
        if (r.status === 401) throw new Error("Sesi habis, silakan login ulang")
        if (!r.ok)            throw new Error("Gagal mengambil data cetak")
        return r.json()
      })
      .then(json => {
        if (!cancelled) setData(Array.isArray(json) ? json : [])
      })
      .catch(err => {
        if (!cancelled) {
          setData([])
          setError(err instanceof Error ? err.message : "Gagal mengambil data cetak")
        }
      })
      .finally(() => { if (!cancelled) setLoading(false) })

    return () => { cancelled = true }
  }, [idsParam, mode])

  return { data, loading, error }
}