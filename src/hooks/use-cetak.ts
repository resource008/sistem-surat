"use client"

import { useEffect, useState } from "react"
import type { RegisterSurat }  from "@/types/surat.types"

const CETAK_IDS_KEY_ALL = "cetak:ids:all"
const CETAK_IDS_KEY_PI  = "cetak:ids:pi"

function getKey(mode: "all" | "pi") {
  return mode === "pi" ? CETAK_IDS_KEY_PI : CETAK_IDS_KEY_ALL
}

export function clearCetakSession(mode: "all" | "pi" = "all") {
  try { sessionStorage.removeItem(getKey(mode)) } catch {}
}

export function getCetakIds(mode: "all" | "pi" = "all"): string {
  try { return sessionStorage.getItem(getKey(mode)) ?? "" } catch { return "" }
}

interface UseCetakDataReturn {
  data    : RegisterSurat[]
  loading : boolean
}

export function useCetakData(idsParam: string, mode: "all" | "pi" = "all"): UseCetakDataReturn {
  const [data,    setData]    = useState<RegisterSurat[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
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

    if (!ids) { setData([]); setLoading(false); return }

    setLoading(true)

    const endpoint = mode === "pi" ? `/api/cetak/pi` : `/api/cetak/all`

    fetch(`${endpoint}?ids=${ids}`)
      .then(r => { if (!r.ok) throw new Error(); return r.json() })
      .then(json => setData(Array.isArray(json) ? json : []))
      .catch(() => setData([]))
      .finally(() => setLoading(false))
  }, [idsParam, mode])

  return { data, loading }
}