"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import useSWR from "swr"
import { toast } from "sonner"
import { ArrowDown, ArrowUp, ChevronLeft, ChevronRight, FileSpreadsheet } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/ui/empty-state"
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

function TrackSheetStatusBadge({ sheet }: { sheet: TrackSheet }) {
  return (
    <Badge variant={sheet.hiddenAt ? "outline" : "secondary"}>
      {sheet.hiddenAt ? "Disembunyikan" : "Ditampilkan"}
    </Badge>
  )
}

export default function TrackTablePage() {
  const router = useRouter()
  const { data, error, isLoading, mutate } = useSWR<TrackTableResponse>("/api/admin/track-table", fetcher)
  const [reorderingId, setReorderingId] = useState<string | null>(null)
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

  async function moveSheet(sheetId: string, direction: -1 | 1) {
    const currentIndex = sheets.findIndex((sheet) => sheet.id === sheetId)
    const targetIndex = currentIndex + direction
    if (currentIndex < 0 || targetIndex < 0 || targetIndex >= sheets.length) return

    const nextSheets = [...sheets]
    const [sheet] = nextSheets.splice(currentIndex, 1)
    nextSheets.splice(targetIndex, 0, sheet)

    setReorderingId(sheetId)
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

      toast.success(json?.message ?? "Urutan master tabel berhasil diubah")
      await mutate(json?.data ?? undefined, { revalidate: true })
    } catch (err) {
      toast.error(getErrorMessage(err, "Gagal mengubah urutan master tabel"))
    } finally {
      setReorderingId(null)
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
      <div className={`${sheets.length > 0 ? "hidden md:block" : ""} overflow-hidden rounded-xl border border-border/40 bg-background`}>
        {sheets.length === 0 ? (
          <EmptyState
            icon={<FileSpreadsheet size={64} strokeWidth={1.25} />}
            title={error ? "Gagal memuat master tabel" : "Belum ada sheet lacak"}
            description={error?.message ?? "Tambahkan sheet pertama untuk mulai mengelola tabel lacak."}
          />
        ) : (
          <div className="overflow-x-auto">
            <div className="grid min-w-[640px] grid-cols-[minmax(220px,1fr)_140px_140px_120px] border-b border-border/40 bg-muted/40 px-4 py-3 text-[12px] font-medium text-muted-foreground">
              <div>Nama Sheet</div>
              <div>Status</div>
              <div>Kolom</div>
              <div>Aksi</div>
            </div>

            {paginatedSheets.map((sheet, pageIndex) => {
              const sheetIndex = pageStartIndex + pageIndex

              return (
                <div
                  key={sheet.id}
                  role="button"
                  tabIndex={0}
                  className="grid min-w-[640px] cursor-pointer grid-cols-[minmax(220px,1fr)_140px_140px_120px] items-center border-b border-border/40 px-4 py-3 outline-none transition-colors last:border-b-0 hover:bg-muted/30 focus-visible:bg-muted/40"
                  onClick={() => openDetail(sheet)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault()
                      openDetail(sheet)
                    }
                  }}
                >
                  <div className="flex min-w-0 items-center gap-2 pr-4">
                    <span className="truncate text-[13px] font-medium">{sheet.name}</span>
                  </div>
                  <div>
                    <TrackSheetStatusBadge sheet={sheet} />
                  </div>
                  <div>
                    <Badge variant="secondary">{sheet.fields.length} kolom</Badge>
                  </div>
                  <div className="flex items-center gap-1" onClick={(event) => event.stopPropagation()}>
                    <Button
                      type="button"
                      variant="action-neutral"
                      size="icon-sm"
                      aria-label={`Naikkan urutan ${sheet.name}`}
                      disabled={!!reorderingId || sheetIndex === 0}
                      onClick={() => moveSheet(sheet.id, -1)}
                    >
                      <ArrowUp />
                    </Button>
                    <Button
                      type="button"
                      variant="action-neutral"
                      size="icon-sm"
                      aria-label={`Turunkan urutan ${sheet.name}`}
                      disabled={!!reorderingId || sheetIndex === sheets.length - 1}
                      onClick={() => moveSheet(sheet.id, 1)}
                    >
                      <ArrowDown />
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {sheets.length > 0 ? (
        <div className="grid gap-3 md:hidden">
          {paginatedSheets.map((sheet, pageIndex) => {
            const sheetIndex = pageStartIndex + pageIndex

            return (
              <div
                key={sheet.id}
                role="button"
                tabIndex={0}
                className="overflow-hidden rounded-xl border border-border/40 bg-background outline-none transition-colors hover:bg-muted/20 focus-visible:bg-muted/30"
                onClick={() => openDetail(sheet)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault()
                    openDetail(sheet)
                  }
                }}
              >
                <div className="grid gap-3 p-4">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold text-foreground">{sheet.name}</div>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs text-muted-foreground">Status</span>
                    <TrackSheetStatusBadge sheet={sheet} />
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs text-muted-foreground">Jumlah kolom</span>
                    <Badge variant="secondary">{sheet.fields.length} kolom</Badge>
                  </div>
                </div>
                <div
                  className="grid grid-cols-2 border-t border-border/40"
                  onClick={(event) => event.stopPropagation()}
                >
                  <Button
                    type="button"
                    variant="action-neutral"
                    className="h-10 rounded-none border-0 border-r border-border/40"
                    aria-label={`Naikkan urutan ${sheet.name}`}
                    disabled={!!reorderingId || sheetIndex === 0}
                    onClick={() => moveSheet(sheet.id, -1)}
                  >
                    <ArrowUp />
                    Naikkan
                  </Button>
                  <Button
                    type="button"
                    variant="action-neutral"
                    className="h-10 rounded-none border-0"
                    aria-label={`Turunkan urutan ${sheet.name}`}
                    disabled={!!reorderingId || sheetIndex === sheets.length - 1}
                    onClick={() => moveSheet(sheet.id, 1)}
                  >
                    <ArrowDown />
                    Turunkan
                  </Button>
                </div>
              </div>
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
