"use client"

import { format } from "date-fns"
import { id } from "date-fns/locale"
import { useSearchParams } from "next/navigation"
import { Suspense, useEffect, useState } from "react"

import { LoadingSkeleton } from "@/components/shared/loading-skeleton"
import { CetakEmpty } from "@/components/surat/cetak/empty-state"
import { CetakPrintStyles } from "@/components/surat/cetak/print-styles"
import { CetakPrintViewPI, type CetakGroupPI } from "@/components/surat/cetak/print-view-pi"
import { CetakScreenView } from "@/components/surat/cetak/screen-view"
import { clearCetakSession, useCetakData } from "@/hooks/use-cetak"
import { calcTotalSurat, groupCetakData } from "@/lib/surat-helpers"

function CetakPIContent() {
  const searchParams          = useSearchParams()
  const idsParam              = searchParams.get("ids") ?? ""
  const { data, loading }     = useCetakData(idsParam, "pi")
  const [cleared, setCleared] = useState(false)

  useEffect(() => {
    const handler = () => {
      clearCetakSession("pi")
      setCleared(true)
      window.dispatchEvent(new CustomEvent("cetak:cleared"))
    }
    window.addEventListener("cetak:clear", handler)
    return () => window.removeEventListener("cetak:clear", handler)
  }, [])

  if (loading) {
    return (
      <div className="w-full mt-2">
        <LoadingSkeleton type="table" />
      </div>
    )
  }

  const groups     = cleared ? [] : groupCetakData(data) as unknown as CetakGroupPI[]
  const totalSurat = cleared ? 0  : calcTotalSurat(data)
  const printedAt  = format(new Date(), "dd MMMM yyyy, HH:mm", { locale: id })

  return (
    <>
      <CetakPrintStyles />
      <CetakScreenView
        groups={groups as any}
        activeFilter="PI"
        onBersihkan={() => window.dispatchEvent(new CustomEvent("cetak:clear"))}
      />
      {groups.length === 0 && (
        <div className="flex min-h-[60vh] items-center justify-center">
          <CetakEmpty />
        </div>
      )}
      {groups.length > 0 && (
        <CetakPrintViewPI groups={groups} totalSurat={totalSurat} printedAt={printedAt} />
      )}
    </>
  )
}

export default function CetakPiPage() {
   return (
    <Suspense fallback={
      <div className="flex min-h-[60vh] w-full items-center justify-center p-6">
        <LoadingSkeleton type="table" />
      </div>
    }>
      <CetakPIContent />
    </Suspense>
  )
}