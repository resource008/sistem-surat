"use client"

import { useState, useEffect, Suspense }   from "react"
import { useSearchParams }                  from "next/navigation"
import { format }                           from "date-fns"
import { id }                              from "date-fns/locale"

import { useCetakData, clearCetakSession } from "@/hooks/use-cetak"
import { groupCetakData, calcTotalSurat }  from "@/lib/surat-helpers"
import { CetakEmpty }                      from "@/components/surat/cetak/empty-state"
import { LoadingSkeleton }                 from "@/components/shared/loading-skeleton"
import { CetakPrintStyles }               from "@/components/surat/cetak/print-styles"
import { CetakScreenView }                from "@/components/surat/cetak/screen-view"
import type { CetakGroup }                from "@/types/surat-types"
import type { CetakGroupPI }              from "@/components/surat/cetak/print-view-pi"

type SessionType  = "all" | "pi"
type ActiveFilter = "ALL" | "PI"

interface CetakPageContentProps<G> {
  sessionType  : SessionType
  activeFilter : ActiveFilter
  PrintView    : React.ComponentType<{ groups: G[]; totalSurat: number; printedAt: string }>
  /** Hanya diperlukan jika berbeda dari default (auto-detect dari pathname) */
  basePath?    : string
}

function CetakContent<G extends CetakGroup | CetakGroupPI>({
  sessionType,
  activeFilter,
  PrintView,
  basePath,
}: CetakPageContentProps<G>) {
  const searchParams          = useSearchParams()
  const idsParam              = searchParams.get("ids") ?? ""
  const { data, loading }     = useCetakData(idsParam, sessionType)
  const [cleared, setCleared] = useState(false)

  useEffect(() => {
    const handler = () => {
      clearCetakSession(sessionType)
      setCleared(true)
      window.dispatchEvent(new CustomEvent("cetak:cleared"))
    }
    window.addEventListener("cetak:clear", handler)
    return () => window.removeEventListener("cetak:clear", handler)
  }, [sessionType])

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <LoadingSkeleton type="table" />
      </div>
    )
  }

  const groups     = cleared ? [] : (groupCetakData(data) as unknown as G[])
  const totalSurat = cleared ? 0  : calcTotalSurat(data)
  const printedAt  = format(new Date(), "dd MMMM yyyy, HH:mm", { locale: id })

  return (
    <>
      <CetakPrintStyles />
      <CetakScreenView
        groups={groups as any}
        activeFilter={activeFilter}
        basePath={basePath}
        onBersihkan={() => window.dispatchEvent(new CustomEvent("cetak:clear"))}
      />
      {groups.length === 0 && (
        <div className="flex min-h-[60vh] items-center justify-center">
          <CetakEmpty />
        </div>
      )}
      {groups.length > 0 && (
        <PrintView groups={groups} totalSurat={totalSurat} printedAt={printedAt} />
      )}
    </>
  )
}

export function CetakPageContent<G extends CetakGroup | CetakGroupPI>(
  props: CetakPageContentProps<G>
) {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <LoadingSkeleton type="table" />
        </div>
      }
    >
      <CetakContent {...props} />
    </Suspense>
  )
}