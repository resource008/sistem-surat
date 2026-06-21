"use client"

import type { RegisterSurat } from "@/types/surat-types"
import { useEffect, useState } from "react"

const CETAK_IDS_KEY = "cetak:ids"

function isClient() { return typeof window !== "undefined" }

export function clearCetakSession() {
  if (!isClient()) return
  try {
    sessionStorage.removeItem(CETAK_IDS_KEY)
  } catch {}
}

export function getCetakIds(): string {
  if (!isClient()) return ""
  try {
    return sessionStorage.getItem(CETAK_IDS_KEY) ?? ""
  } catch { return "" }
}

interface UseCetakDataReturn {
  data    : RegisterSurat[]
  loading : boolean
  error   : string | null
}

export function useCetakData(idsParam: string, printSheetName: string): UseCetakDataReturn {
  const [data,    setData]    = useState<RegisterSurat[]>([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    let ids   = idsParam

    if (ids) {
      try { sessionStorage.setItem(CETAK_IDS_KEY, ids) } catch {}
    } else {
      try {
        ids = sessionStorage.getItem(CETAK_IDS_KEY) ?? ""
      } catch {}
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

    const sheetPath = printSheetName.trim()
      ? `/${encodeURIComponent(printSheetName)}`
      : ""

    fetch(`/api/cetak${sheetPath}?ids=${encodeURIComponent(ids)}&includeColumns=true`)
      .then(async r => {
        if (r.status === 401) throw new Error("Sesi habis, silakan login ulang")
        if (!r.ok) {
          const json = await r.json().catch(() => null)
          throw new Error(json?.error ?? "Gagal mengambil data cetak")
        }
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
  }, [idsParam, printSheetName])

  return { data, loading, error }
}
