"use client"

import { useEffect, useState } from "react"
import type { RegisterSurat }  from "@/types/surat.types"

const CETAK_IDS_KEY = "cetak:ids"

export function clearCetakSession() {
  try { sessionStorage.removeItem(CETAK_IDS_KEY) } catch {}
}

// ✅ Helper baru — baca langsung dari sessionStorage
export function getCetakIds(): string {
  try { return sessionStorage.getItem(CETAK_IDS_KEY) ?? "" } catch { return "" }
}

interface UseCetakDataReturn {
  data    : RegisterSurat[]
  loading : boolean
}

export function useCetakData(idsParam: string): UseCetakDataReturn {
  const [data,    setData]    = useState<RegisterSurat[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let ids = idsParam

    if (ids) {
      try { sessionStorage.setItem(CETAK_IDS_KEY, ids) } catch {}
    } else {
      try { ids = sessionStorage.getItem(CETAK_IDS_KEY) ?? "" } catch {}
    }

    // ✅ Dispatch ke layout — beritahu berapa ids yang aktif
    window.dispatchEvent(new CustomEvent("cetak:ids-ready", {
      detail: { count: ids.split(",").filter(Boolean).length }
    }))

    if (!ids) {
      setData([])
      setLoading(false)
      return
    }

    setLoading(true)
    fetch(`/api/surat?ids=${ids}`)
      .then(r => { if (!r.ok) throw new Error(); return r.json() })
      .then(json => setData(Array.isArray(json) ? json : []))
      .catch(() => setData([]))
      .finally(() => setLoading(false))
  }, [idsParam])

  return { data, loading }
}