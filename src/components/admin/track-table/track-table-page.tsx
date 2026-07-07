"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import useSWR from "swr"
import { toast } from "sonner"
import { ArrowDown, ArrowUp, FileSpreadsheet } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/ui/empty-state"
import { getErrorMessage } from "@/lib/utils"
import type { TrackSheet, TrackTableResponse } from "@/types"
import { TrackTableAddFab } from "./track-table-add-fab"
import { TrackTableListSkeleton } from "./track-table-skeletons"

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
  const sheets = data?.sheets ?? []

  function openDetail(sheet: TrackSheet) {
    router.push(`/admin/kelola-tabel-lacak/${encodeURIComponent(sheet.id)}`)
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
        <TrackTableAddFab onClick={() => router.push("/admin/kelola-tabel-lacak/add")} />
      </>
    )
  }

  return (
    <div className="flex flex-col gap-4 pb-24">
      <div className="hidden overflow-hidden rounded-xl border border-border/40 bg-background md:block">
        {sheets.length === 0 ? (
          <EmptyState
            icon={<FileSpreadsheet size={64} strokeWidth={1.25} />}
            title={error ? "Gagal memuat master tabel" : "Belum ada sheet lacak"}
            description={error?.message ?? "Tambahkan sheet pertama untuk mulai mengelola tabel lacak."}
          />
        ) : (
          <>
            <div className="grid grid-cols-[minmax(0,1fr)_140px_140px_120px] border-b border-border/40 bg-muted/40 px-4 py-3 text-[12px] font-medium text-muted-foreground">
              <div>Nama Sheet</div>
              <div>Status</div>
              <div>Kolom</div>
              <div>Aksi</div>
            </div>

            {sheets.map((sheet, index) => (
              <div
                key={sheet.id}
                role="button"
                tabIndex={0}
                className="grid cursor-pointer grid-cols-[minmax(0,1fr)_140px_140px_120px] items-center border-b border-border/40 px-4 py-3 outline-none transition-colors last:border-b-0 hover:bg-muted/30 focus-visible:bg-muted/40"
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
                    disabled={!!reorderingId || index === 0}
                    onClick={() => moveSheet(sheet.id, -1)}
                  >
                    <ArrowUp />
                  </Button>
                  <Button
                    type="button"
                    variant="action-neutral"
                    size="icon-sm"
                    aria-label={`Turunkan urutan ${sheet.name}`}
                    disabled={!!reorderingId || index === sheets.length - 1}
                    onClick={() => moveSheet(sheet.id, 1)}
                  >
                    <ArrowDown />
                  </Button>
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      <div className="grid gap-3 md:hidden">
        {sheets.length === 0 ? (
          <div className="rounded-xl border border-border/40 bg-background">
            <EmptyState
              icon={<FileSpreadsheet size={64} strokeWidth={1.25} />}
              title={error ? "Gagal memuat master tabel" : "Belum ada sheet lacak"}
              description={error?.message ?? "Tambahkan sheet pertama untuk mulai mengelola tabel lacak."}
            />
          </div>
        ) : (
          sheets.map((sheet, index) => (
            <div
              key={sheet.id}
              role="button"
              tabIndex={0}
              className="rounded-xl border border-border/40 bg-background p-4 text-left transition-colors hover:bg-muted/30"
              onClick={() => openDetail(sheet)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault()
                  openDetail(sheet)
                }
              }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex min-w-0 flex-wrap items-center gap-2">
                    <span className="truncate text-sm font-semibold">{sheet.name}</span>
                  </div>
                </div>
                <Badge variant="secondary">{sheet.fields.length} kolom</Badge>
              </div>
              <div className="mt-3 flex items-center justify-between gap-3">
                <span className="text-xs text-muted-foreground">Status</span>
                <TrackSheetStatusBadge sheet={sheet} />
              </div>
              <div className="mt-3 flex items-center justify-between gap-3">
                <span className="text-xs text-muted-foreground">Aksi</span>
                <div className="flex items-center gap-1" onClick={(event) => event.stopPropagation()}>
                  <Button
                    type="button"
                    variant="action-neutral"
                    size="icon-sm"
                    aria-label={`Naikkan urutan ${sheet.name}`}
                    disabled={!!reorderingId || index === 0}
                    onClick={() => moveSheet(sheet.id, -1)}
                  >
                    <ArrowUp />
                  </Button>
                  <Button
                    type="button"
                    variant="action-neutral"
                    size="icon-sm"
                    aria-label={`Turunkan urutan ${sheet.name}`}
                    disabled={!!reorderingId || index === sheets.length - 1}
                    onClick={() => moveSheet(sheet.id, 1)}
                  >
                    <ArrowDown />
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <TrackTableAddFab onClick={() => router.push("/admin/kelola-tabel-lacak/add")} />
    </div>
  )
}
