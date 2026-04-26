"use client"

import { useState, useEffect }         from "react"   // ← tambah useEffect
import { useRouter, useSearchParams }   from "next/navigation"
import { format }                       from "date-fns"
import { id }                           from "date-fns/locale"

import { useCetakData, clearCetakSession } from "@/hooks/use-cetak"
import { groupCetakData, calcTotalSurat }  from "@/services/surat.service"
import { LoadingSpinner }                  from "@/components/shared/loading-skeleton"
import { CetakEmpty }                      from "@/components/surat/cetak-empty"
import { CetakPrintStyles }                from "@/components/surat/cetak-print-styles"
import { CetakScreenView }                 from "@/components/surat/cetak-screen-view"
import { CetakPrintView }                  from "@/components/surat/cetak-print-view"

export default function CetakSuratPage() {
  const searchParams          = useSearchParams()
  const router                = useRouter()
  const idsParam              = searchParams.get("ids") ?? ""
  const { data, loading }     = useCetakData(idsParam)
  const [cleared, setCleared] = useState(false)

  // ── Tambah ini: listen event dari layout ─────────────────
  useEffect(() => {
    const handler = () => {
      clearCetakSession()
      setCleared(true)
      window.dispatchEvent(new CustomEvent("cetak:cleared"))  // ← layout nonaktifkan button
    }
    window.addEventListener("cetak:clear", handler)
    return () => window.removeEventListener("cetak:clear", handler)
  }, [])
  // ─────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <LoadingSpinner message="Memuat data cetak…" />
      </div>
    )
  }

  const groups     = cleared ? [] : groupCetakData(data)
  const totalSurat = cleared ? 0  : calcTotalSurat(data)

  if (groups.length === 0) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <CetakEmpty onBack={() => router.back()} />
      </div>
    )
  }

  const printedAt = format(new Date(), "dd MMMM yyyy, HH:mm", { locale: id })

  return (
    <>
      <CetakPrintStyles />
      <CetakScreenView groups={groups} onBersihkan={() => {
        // Fallback jika ada tombol bersihkan di dalam page juga
        window.dispatchEvent(new CustomEvent("cetak:clear"))
      }} />
      <CetakPrintView
        groups={groups}
        totalSurat={totalSurat}
        printedAt={printedAt}
      />
    </>
  )
}