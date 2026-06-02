"use client"

import { LoadingSkeleton } from "@/components/shared/loading-skeleton"
import { Role } from "@/components/surat/shared"
import { EmptyState } from "@/components/ui/empty-state"
import { Loader2, Plus } from "lucide-react"
import { Suspense, useEffect, useRef } from "react"

import { useDataSurat } from "@/hooks/use-data-surat"
import { FloatingActionBar } from "./action-bar"
import { DesktopTable } from "./desktop-table"
import { MobileList } from "./mobile-list"

interface Props {
  role: Role
  basePath: string
  printPath: string
}

function DataSuratInner({ basePath, printPath }: Props) {
  const { state, actions } = useDataSurat(printPath)

  const sentinelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!sentinelRef.current) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && state.hasMore && !state.loadingMore) {
          actions.loadMore()
        }
      },
      { threshold: 0.1 }
    )
    observer.observe(sentinelRef.current)
    return () => observer.disconnect()
  }, [state.hasMore, state.loadingMore, actions.loadMore])

  if (state.loading) {
    return <div className="w-full mt-2"><LoadingSkeleton type="table" /></div>
  }

  if (state.filteredData.length === 0) {
    return (
      <EmptyState
        description={
          <span className="leading-none">
            {state.filterDate || state.filterDepts.length > 0 || state.showPI
              ? "Tidak ada data yang sesuai filter."
              : <>
                  Silakan tambahkan data baru dengan mengklik tombol
                  <span className="inline-flex align-middle ml-1 text-blue-600 dark:text-blue-400 -translate-y-px">
                    <Plus size={18} strokeWidth={3} />
                  </span>
                </>
            }
          </span>
        }
      />
    )
  }

  return (
    <div className="w-full animate-in fade-in duration-500 flex flex-col gap-3 pb-24">
      {state.sortedGroupKeys.map((groupKey) => {
        const [date, dept] = groupKey.split("|||")
        const registers    = state.groupedData[groupKey]

        return (
          <div key={groupKey} className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
              <span className="text-[12px] font-medium text-slate-700 dark:text-slate-300">{date}</span>
              <span className="text-[11px] font-medium text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-full px-2.5 py-0.5">
                {dept}
              </span>
            </div>
            <MobileList
              registers={registers}
              showPI={state.showPI}
              selectedIds={state.selectedIds}
              basePath={basePath}
              actions={actions}
            />
            <DesktopTable
              registers={registers}
              showPI={state.showPI}
              selectedIds={state.selectedIds}
              basePath={basePath}
              actions={actions}
            />
          </div>
        )
      })}

      {/* Sentinel — trigger load more saat masuk viewport */}
      <div ref={sentinelRef} className="h-1" />

      {/* Spinner load more */}
      {state.loadingMore && (
        <div className="flex justify-center py-4">
          <Loader2 size={20} className="animate-spin text-slate-400" />
        </div>
      )}

      {/* Semua data sudah tampil */}
      {!state.hasMore && state.filteredData.length > 0 && (
        <p className="text-center text-[12px] text-slate-400 dark:text-slate-600 py-4">
          Semua data sudah ditampilkan
        </p>
      )}

      <FloatingActionBar state={state} actions={actions} />
    </div>
  )
}

export default function DataSuratPage(props: Props) {
  return (
    <Suspense fallback={<div className="w-full mt-2"><LoadingSkeleton type="table" /></div>}>
      <DataSuratInner {...props} />
    </Suspense>
  )
}