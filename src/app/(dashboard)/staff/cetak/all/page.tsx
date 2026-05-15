"use client"

import { format } from "date-fns"
import { id } from "date-fns/locale"
import { useSearchParams } from "next/navigation"
import { Suspense, useEffect, useState } from "react"

import { LoadingSkeleton } from "@/components/shared/loading-skeleton"
import { CetakEmpty } from "@/components/surat/cetak/empty-state"
import { CetakPrintStyles } from "@/components/surat/cetak/print-styles"
import { CetakPrintView } from "@/components/surat/cetak/print-view"
import { CetakScreenView } from "@/components/surat/cetak/screen-view"
import { clearCetakSession, useCetakData } from "@/hooks/use-cetak"
import { calcTotalSurat, groupCetakData } from "@/lib/surat-helpers"

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
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <LoadingSkeleton type="table" />
      </div>
    )
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
    <Suspense fallback={
      <div className="w-full mt-2">
        <LoadingSkeleton type="table" />
      </div>
    }>
      <CetakAllContent />
    </Suspense>
  )
}