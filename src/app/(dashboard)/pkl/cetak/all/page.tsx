"use client"

import { useState, useEffect, Suspense }        from "react"
import { useSearchParams }            from "next/navigation"
import { format }                     from "date-fns"
import { id }                         from "date-fns/locale"

import { useCetakData, clearCetakSession } from "@/hooks/use-cetak"
import { groupCetakData, calcTotalSurat }  from "@/lib/surat-helpers"
import { CetakEmpty }                      from "@/components/surat/cetak/empty-state"
import { LoadingSkeleton }                  from "@/components/shared/loading-skeleton"
import { CetakPrintStyles }                from "@/components/surat/cetak/print-styles"
import { CetakScreenView }                 from "@/components/surat/cetak/screen-view"
import { CetakPrintView }                  from "@/components/surat/cetak/print-view"

function CetakAllContent() {
  const searchParams          = useSearchParams()
  const idsParam              = searchParams.get("ids") ?? ""
  const { data, loading }     = useCetakData(idsParam, "all")
  const [cleared, setCleared] = useState(false)

  useEffect(() => {
    const handler = () => {
      clearCetakSession("all")
      setCleared(true)
      window.dispatchEvent(new CustomEvent("cetak:cleared"))
    }
    window.addEventListener("cetak:clear", handler)
    return () => window.removeEventListener("cetak:clear", handler)
  }, [])

  if (loading) {
    return <LoadingSkeleton type="table" className="w-full" />
  }

  const groups     = cleared ? [] : groupCetakData(data)
  const totalSurat = cleared ? 0  : calcTotalSurat(data)
  const printedAt  = format(new Date(), "dd MMMM yyyy, HH:mm", { locale: id })

  return (
    <>
      <CetakPrintStyles />
      <CetakScreenView
        groups={groups}
        activeFilter="ALL"
        basePath="/pkl/cetak"
        onBersihkan={() => window.dispatchEvent(new CustomEvent("cetak:clear"))}
      />
      {groups.length === 0 && (
        <div className="flex min-h-[60vh] items-center justify-center">
          <CetakEmpty />
        </div>
      )}
      {groups.length > 0 && (
        <CetakPrintView groups={groups} totalSurat={totalSurat} printedAt={printedAt} />
      )}
    </>
  )
}

export default function CetakAllPage() {
  return (
    <Suspense fallback={<LoadingSkeleton type="table" className="w-full mt-2" />}>
      <CetakAllContent />
    </Suspense>
  )
}