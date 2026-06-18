"use client"

import type { RegisterSurat } from "@/types/surat-types"
import { useEffect, useState } from "react"

const CETAK_IDS_KEY_ALL = "cetak:ids:all"

function isClient() { return typeof window !== "undefined" }

export function clearCetakSession() {
  if (!isClient()) return
  try { sessionStorage.removeItem(CETAK_IDS_KEY_ALL) } catch {}
}

export function getCetakIds(): string {
  if (!isClient()) return ""
  try { return sessionStorage.getItem(CETAK_IDS_KEY_ALL) ?? "" } catch { return "" }
}

interface UseCetakDataReturn {
  data    : RegisterSurat[]
  loading : boolean
  error   : string | null
}

export function useCetakData(idsParam: string): UseCetakDataReturn {
  const [data,    setData]    = useState<RegisterSurat[]>([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    let ids   = idsParam

    if (ids) {
      try { sessionStorage.setItem(CETAK_IDS_KEY_ALL, ids) } catch {}
    } else {
      try { ids = sessionStorage.getItem(CETAK_IDS_KEY_ALL) ?? "" } catch {}
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

    fetch(`/api/cetak/all?ids=${encodeURIComponent(ids)}`)
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
  }, [idsParam])

  return { data, loading, error }
}
