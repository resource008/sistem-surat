"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import useSWR from "swr"
import { toast } from "sonner"
import { reorder } from "@atlaskit/pragmatic-drag-and-drop/reorder"
import { ChevronLeft, ChevronRight, FileSpreadsheet, Menu } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/ui/empty-state"
import { PragmaticSortableItem } from "@/components/shared/pragmatic-sortable-item"
import { getErrorMessage } from "@/lib/utils"
import type { TrackSheet, TrackTableResponse } from "@/types"
import { TrackTableAddFab } from "./track-table-add-fab"
import { TrackTableListSkeleton } from "./track-table-skeletons"

const TRACK_TABLES_PER_PAGE = 10

const fetcher = async (url: string): Promise<TrackTableResponse> => {
  const res = await fetch(url)
  const json = await res.json()
  if (!res.ok) throw new Error(json.error ?? "Gagal mengambil tabel lacak")
  return json
}

function TrackSheetStatusToggle({
  sheet,
  disabled,
  onChange,
}: {
  sheet: TrackSheet
  disabled?: boolean
  onChange: (sheet: TrackSheet, nextVisible: boolean) => void
}) {
  const isVisible = !sheet.hiddenAt

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isVisible}
      aria-label={isVisible ? "Sembunyikan sheet lacak" : "Tampilkan sheet lacak"}
      disabled={disabled}
      onKeyDown={(event) => event.stopPropagation()}
      onClick={(event) => {
        event.stopPropagation()
        onChange(sheet, !isVisible)
      }}
      className={[
        "relative inline-flex h-7 w-12 shrink-0 items-center rounded-full border px-1",
        "transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
        isVisible ? "border-primary bg-primary" : "border-border bg-muted",
        disabled ? "cursor-not-allowed opacity-55" : "",
      ].join(" ")}
    >
      <span className={`absolute left-2 text-[10px] font-semibold leading-none ${isVisible ? "text-primary-foreground" : "text-muted-foreground"}`}>
        I
      </span>
      <span className={`absolute right-2 text-[10px] font-semibold leading-none ${isVisible ? "text-primary-foreground/70" : "text-foreground"}`}>
        O
      </span>
      <span
        className={[
          "relative z-10 size-5 rounded-full shadow-sm transition-transform",
          isVisible ? "translate-x-5 bg-primary-foreground" : "translate-x-0 bg-background",
        ].join(" ")}
      />
    </button>
  )
}

export default function TrackTablePage() {
  const router = useRouter()
  const { data, error, isLoading, mutate } = useSWR<TrackTableResponse>("/api/admin/track-table", fetcher)
  const [reorderingId, setReorderingId] = useState<string | null>(null)
  const [visibilityId, setVisibilityId] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const sheets = data?.sheets ?? []
  const totalPages = Math.max(1, Math.ceil(sheets.length / TRACK_TABLES_PER_PAGE))
  const pageStartIndex = (currentPage - 1) * TRACK_TABLES_PER_PAGE
  const pageEndIndex = Math.min(sheets.length, pageStartIndex + TRACK_TABLES_PER_PAGE)
  const paginatedSheets = sheets.slice(pageStartIndex, pageEndIndex)
  const showPagination = sheets.length > TRACK_TABLES_PER_PAGE

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages)
    }
  }, [currentPage, totalPages])

  function openDetail(sheet: TrackSheet) {
    router.push(`/admin/lacak-surat/${encodeURIComponent(sheet.id)}`)
  }

  async function reorderSheets(startIndex: number, finishIndex: number) {
    if (
      startIndex < 0 ||
      finishIndex < 0 ||
      startIndex >= sheets.length ||
      finishIndex >= sheets.length ||
      startIndex === finishIndex
    ) {
      return
    }

    const nextSheets = reorder({
      list: sheets,
      startIndex,
      finishIndex,
    })

    setReorderingId(sheets[startIndex]?.id ?? null)
    try {
      const res = await fetch("/api/admin/track-table/order", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: nextSheets.map((item, index) => ({
            id: item.id,
            sortOrder: index,
          })),
        }),
      })
      const json = await res.json().catch(() => null)

      if (!res.ok) {
        throw new Error(json?.error ?? json?.message ?? "Gagal mengubah urutan master tabel")
      }

      toast.success(json?.message ?? "Urutan Item Sheet Berhasil dipindahkan")
      await mutate(json?.data ?? undefined, { revalidate: true })
    } catch (err) {
      toast.error(getErrorMessage(err, "Gagal mengubah urutan master tabel"))
    } finally {
      setReorderingId(null)
    }
  }

  async function setSheetVisibility(sheet: TrackSheet, nextVisible: boolean) {
    setVisibilityId(sheet.id)

    try {
      const res = await fetch(`/api/admin/track-table/${encodeURIComponent(sheet.id)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: nextVisible ? "show" : "hide" }),
      })
      const json = await res.json().catch(() => null)

      if (!res.ok) {
        throw new Error(json?.error ?? json?.message ?? "Gagal mengubah status sheet lacak")
      }

      toast.success(json?.message ?? (
        nextVisible ? "Sheet lacak berhasil ditampilkan" : "Data sheet lacak berhasil disembunyikan"
      ))
      await mutate()
    } catch (err) {
      toast.error(getErrorMessage(err, "Gagal mengubah status sheet lacak"))
    } finally {
      setVisibilityId(null)
    }
  }

  if (isLoading) {
    return (
      <>
        <TrackTableListSkeleton />
        <TrackTableAddFab onClick={() => router.push("/admin/lacak-surat/add")} />
      </>
    )
  }

  return (
    <div className="flex flex-col gap-4 pb-24">
      <div className={`${sheets.length > 0 ? "hidden md:block" : ""} max-h-[calc(100svh-180px)] overflow-hidden rounded-xl border border-border/40 bg-background`}>
        {sheets.length === 0 ? (
          <EmptyState
            icon={<FileSpreadsheet size={64} strokeWidth={1.25} />}
            title={error ? "Gagal memuat master tabel" : "Belum ada sheet lacak"}
            description={error?.message ?? "Tambahkan sheet pertama untuk mulai mengelola tabel lacak."}
          />
        ) : (
          <div className="max-h-[calc(100svh-180px)] overflow-auto">
            <div className="sticky top-0 z-10 grid min-w-[560px] grid-cols-[minmax(220px,1fr)_140px_140px] border-b border-border/40 bg-muted/40 px-4 py-3 text-[12px] font-medium text-muted-foreground">
              <div>Nama Sheet</div>
              <div>Status</div>
              <div>Kolom</div>
            </div>

            {paginatedSheets.map((sheet, pageIndex) => {
              const sheetIndex = pageStartIndex + pageIndex

              return (
                <PragmaticSortableItem
                  key={sheet.id}
                  id={sheet.id}
                  index={sheetIndex}
                  type="track-sheet"
                  disabled={Boolean(reorderingId)}
                  dragSurfaceOnly
                  onReorder={reorderSheets}
                >
                  <div
                    role="button"
                    tabIndex={0}
                    className="grid min-w-[560px] grid-cols-[minmax(220px,1fr)_140px_140px] items-center border-b border-border/40 px-4 py-3 outline-none transition-colors last:border-b-0 hover:bg-muted/30 focus-visible:bg-muted/40"
                    onClick={() => openDetail(sheet)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault()
                        openDetail(sheet)
                      }
                    }}
                  >
                    <div className="flex min-w-0 items-center gap-2 pr-4">
                      <Menu
                        data-drag-surface="true"
                        aria-hidden="true"
                        className="size-4 shrink-0 cursor-grab text-muted-foreground active:cursor-grabbing"
                      />
                      <span className="truncate text-[13px] font-medium">{sheet.name}</span>
                    </div>
                    <div className="flex justify-start">
                      <TrackSheetStatusToggle
                        sheet={sheet}
                        disabled={visibilityId === sheet.id}
                        onChange={setSheetVisibility}
                      />
                    </div>
                    <div>
                      <Badge variant="secondary">{sheet.fields.length} kolom</Badge>
                    </div>
                  </div>
                </PragmaticSortableItem>
              )
            })}
          </div>
        )}
      </div>

      {sheets.length > 0 ? (
        <div className="grid max-h-[calc(100svh-170px)] gap-3 overflow-y-auto pr-1 md:hidden">
          {paginatedSheets.map((sheet, pageIndex) => {
            return (
              <PragmaticSortableItem
                key={sheet.id}
                id={sheet.id}
                index={pageStartIndex + pageIndex}
                type="track-sheet"
                disabled={Boolean(reorderingId)}
                dragSurfaceOnly
                onReorder={reorderSheets}
              >
                <div
                  role="button"
                  tabIndex={0}
                  className="grid gap-3 rounded-xl border border-border/40 bg-background p-4 outline-none transition-colors hover:bg-muted/20 focus-visible:bg-muted/30"
                  onClick={() => openDetail(sheet)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault()
                      openDetail(sheet)
                    }
                  }}
                >
                  <div className="min-w-0">
                    <div className="flex min-w-0 items-center gap-2">
                      <Menu
                        data-drag-surface="true"
                        aria-hidden="true"
                        className="size-4 shrink-0 cursor-grab text-muted-foreground active:cursor-grabbing"
                      />
                      <span className="truncate text-sm font-semibold text-foreground">{sheet.name}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs text-muted-foreground">Status</span>
                    <TrackSheetStatusToggle
                      sheet={sheet}
                      disabled={visibilityId === sheet.id}
                      onChange={setSheetVisibility}
                    />
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs text-muted-foreground">Jumlah kolom</span>
                    <Badge variant="secondary">{sheet.fields.length} kolom</Badge>
                  </div>
                </div>
              </PragmaticSortableItem>
            )
          })}
        </div>
      ) : null}

      {showPagination ? (
        <div className="flex flex-col gap-3 rounded-xl border border-border/40 bg-background px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            Menampilkan {pageStartIndex + 1}-{pageEndIndex} dari {sheets.length} sheet
          </p>
          <div className="flex items-center justify-between gap-3 sm:justify-end">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
              disabled={currentPage === 1}
              aria-label="Halaman sebelumnya"
            >
              <ChevronLeft className="size-4" />
              Sebelumnya
            </Button>
            <span className="shrink-0 text-sm text-muted-foreground">
              {currentPage}/{totalPages}
            </span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
              disabled={currentPage === totalPages}
              aria-label="Halaman selanjutnya"
            >
              Berikutnya
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      ) : null}

      <TrackTableAddFab onClick={() => router.push("/admin/lacak-surat/add")} />
    </div>
  )
}
