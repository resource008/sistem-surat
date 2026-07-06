"use client"

import { useState, useEffect, Suspense, useMemo }   from "react"
import { useSearchParams }                  from "next/navigation"
import { format }                           from "date-fns"
import { id }                              from "date-fns/locale"

import { useCetakData, clearCetakSession } from "@/hooks/use-cetak"
import { groupCetakData }                  from "@/lib/surat-helpers"
import { CetakEmpty }                      from "@/components/surat/cetak/empty-state"
import { LoadingSkeleton }                 from "@/components/shared/loading-skeleton"
import { CetakPrintStyles }               from "@/components/surat/cetak/print-styles"
import { CetakScreenView }                from "@/components/surat/cetak/screen-view"
import type { CetakGroup }                from "@/types/surat"

type ActiveFilter = string

interface CetakPageContentProps {
  printSheetName : ActiveFilter
  PrintView    : React.ComponentType<{ groups: CetakGroup[]; totalSurat: number; printedAt: string }>
  /** Hanya diperlukan jika berbeda dari default (auto-detect dari pathname) */
  basePath?    : string
}

function CetakContent({
  printSheetName,
  PrintView,
}: CetakPageContentProps) {
  const searchParams          = useSearchParams()
  const idsParam              = searchParams.get("ids") ?? ""
  const { data, loading, error } = useCetakData(idsParam, printSheetName)
  const [cleared, setCleared] = useState(false)
  const [activeTab, setActiveTab] = useState(printSheetName)

  useEffect(() => {
    const handler = () => {
      clearCetakSession()
      setCleared(true)
      window.dispatchEvent(new CustomEvent("cetak:cleared"))
    }
    window.addEventListener("cetak:clear", handler)
    return () => window.removeEventListener("cetak:clear", handler)
  }, [])

  useEffect(() => {
    if (idsParam) setCleared(false)
  }, [idsParam])

  const groups     = useMemo(() => cleared ? [] : groupCetakData(data), [cleared, data])
  const tabLabels  = useMemo(() => {
    const groupLabels = groups
      .map((group) => group.label)
      .filter((label): label is string => Boolean(label))

    return Array.from(new Set(groupLabels))
  }, [groups])
  const effectiveActiveTab = tabLabels.includes(activeTab) ? activeTab : tabLabels[0] ?? ""
  const visibleGroups = effectiveActiveTab
    ? groups.filter((group) => group.label === effectiveActiveTab)
    : groups
  const totalSurat = cleared
    ? 0
    : visibleGroups.reduce((sum, group) => {
        return sum + group.registers.reduce((groupTotal, register) => {
          return groupTotal + (register.detailSurat ?? []).length
        }, 0)
      }, 0)
  const printedAt  = format(new Date(), "dd MMMM yyyy, HH:mm", { locale: id })

  useEffect(() => {
    if (tabLabels.length === 0) return
    if (!tabLabels.includes(activeTab)) setActiveTab(tabLabels[0])
  }, [activeTab, tabLabels])

  if (loading) {
    return (
      <div className="flex empty-state-viewport items-center justify-center">
        <LoadingSkeleton type="table" />
      </div>
    )
  }

  return (
    <>
      <CetakPrintStyles />
      <CetakScreenView
        groups={visibleGroups}
        activeFilter={effectiveActiveTab}
        tabs={tabLabels}
        onTabChange={setActiveTab}
        onBersihkan={() => window.dispatchEvent(new CustomEvent("cetak:clear"))}
      />
      {error ? (
        <div className="flex items-center justify-center">
          <CetakEmpty
            title="Gagal Mengambil Data Cetak"
            description={error}
          />
        </div>
      ) : visibleGroups.length === 0 && (
        <div className="flex items-center justify-center">
          <CetakEmpty />
        </div>
      )}
      {!error && visibleGroups.length > 0 && (
        <PrintView groups={visibleGroups} totalSurat={totalSurat} printedAt={printedAt} />
      )}
    </>
  )
}

export function CetakPageContent(props: CetakPageContentProps) {
  return (
    <Suspense
      fallback={
        <div className="flex empty-state-viewport items-center justify-center">
          <LoadingSkeleton type="table" />
        </div>
      }
    >
      <CetakContent {...props} />
    </Suspense>
  )
}
