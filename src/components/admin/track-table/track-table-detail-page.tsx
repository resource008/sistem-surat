"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import useSWR from "swr"
import { toast } from "sonner"
import { ArrowLeft, Eye, EyeOff, FileSpreadsheet, Pencil, Trash2, X } from "lucide-react"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/ui/empty-state"
import { getErrorMessage } from "@/lib/utils"
import { TRACK_FIELD_TYPES, type TrackField, type TrackFieldType, type TrackSheet } from "@/types"
import { TrackTableDetailSkeleton } from "./track-table-skeletons"

const fetcher = async (url: string): Promise<TrackSheet> => {
  const res = await fetch(url)
  const json = await res.json()
  if (!res.ok) throw new Error(json.error ?? "Gagal mengambil sheet lacak")
  return json
}

function getTypeLabel(type: TrackFieldType) {
  return TRACK_FIELD_TYPES.find((item) => item.value === type)?.label ?? "Teks"
}

function isDefaultIdField(field: TrackField) {
  return field.columnName.trim().toLowerCase() === "id"
}

function getFieldExtraItems(field: TrackField) {
  if (isDefaultIdField(field)) {
    return ["-"]
  }

  if (field.type === "category") {
    return field.categoryOptions.length > 0 ? field.categoryOptions : ["-"]
  }

  return [field.defaultValue || "-"]
}

function FieldExtraBadges({ field }: { field: TrackField }) {
  return (
    <div className="flex flex-col items-start gap-1">
      {getFieldExtraItems(field).map((item, index) => (
        <Badge key={`${field.id}-extra-${index}`} variant="secondary">
          {item}
        </Badge>
      ))}
    </div>
  )
}

export default function TrackTableDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { data: sheet, error, isLoading, mutate } = useSWR<TrackSheet>(
    id ? `/api/admin/track-table/${encodeURIComponent(id)}` : null,
    fetcher,
  )
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deletingMode, setDeletingMode] = useState<"hide" | "hard" | null>(null)
  const [showing, setShowing] = useState(false)

  useEffect(() => {
    window.dispatchEvent(new CustomEvent("breadcrumb:sub", { detail: "Detail Sheet Lacak" }))
    return () => {
      window.dispatchEvent(new CustomEvent("breadcrumb:sub", { detail: null }))
    }
  }, [])

  async function deleteSheet(mode: "hide" | "hard") {
    if (!sheet) return
    setDeletingMode(mode)

    try {
      const query = mode === "hard" ? "?mode=hard" : ""
      const res = await fetch(`/api/admin/track-table/${encodeURIComponent(sheet.id)}${query}`, {
        method: "DELETE",
      })
      const json = await res.json().catch(() => null)

      if (!res.ok) {
        throw new Error(json?.error ?? "Gagal memproses sheet lacak")
      }

      toast.success(json?.message ?? (
        mode === "hard"
          ? "Sheet lacak berhasil dihapus permanen"
          : "Sheet lacak berhasil disembunyikan"
      ))

      if (mode === "hard") {
        router.push("/admin/kelola-tabel-lacak")
        return
      }

      await mutate()
    } catch (err) {
      toast.error(getErrorMessage(err, "Gagal memproses sheet lacak"))
    } finally {
      setDeletingMode(null)
    }
  }

  if (isLoading) {
    return <TrackTableDetailSkeleton />
  }

  async function showSheet() {
    if (!sheet) return
    setShowing(true)

    try {
      const res = await fetch(`/api/admin/track-table/${encodeURIComponent(sheet.id)}?action=show`, {
        method: "PATCH",
      })
      const json = await res.json().catch(() => null)

      if (!res.ok) {
        throw new Error(json?.error ?? json?.message ?? "Gagal menampilkan sheet lacak")
      }

      toast.success(json?.message ?? "Sheet lacak berhasil ditampilkan")
      await mutate(json?.sheet ?? undefined, { revalidate: true })
    } catch (err) {
      toast.error(getErrorMessage(err, "Gagal menampilkan sheet lacak"))
    } finally {
      setShowing(false)
    }
  }

  if (error || !sheet) {
    return (
      <div className="flex min-h-[360px] flex-col items-center justify-center gap-3">
        <p className="text-sm text-muted-foreground">{error?.message ?? "Sheet lacak tidak ditemukan"}</p>
        <Button variant="outline" onClick={() => router.push("/admin/kelola-tabel-lacak")}>
          Kembali
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 pb-32">
      <div className="rounded-xl border border-border/40 bg-background">
        <div className="border-b border-border/40 px-4 py-4">
          <div className="flex items-center gap-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-border/50 bg-muted/40 text-muted-foreground">
              <FileSpreadsheet className="size-4" />
            </span>
            <h2 className="text-base font-semibold">Informasi Sheet</h2>
          </div>
        </div>

        <div className="grid gap-3 px-4 py-4 text-sm">
          <div className="grid gap-1 sm:grid-cols-[140px_minmax(0,1fr)]">
            <span className="text-muted-foreground">Nama Sheet</span>
            <span className="font-medium">{sheet.name}</span>
          </div>
          <div className="grid gap-1 sm:grid-cols-[140px_minmax(0,1fr)]">
            <span className="text-muted-foreground">ID Sheet</span>
            <span className="font-mono text-sm">{sheet.id}</span>
          </div>
          <div className="grid gap-1 sm:grid-cols-[140px_minmax(0,1fr)]">
            <span className="text-muted-foreground">Jumlah Kolom</span>
            <div>
              <Badge variant="secondary">{sheet.fields.length} kolom</Badge>
            </div>
          </div>
          <div className="grid gap-1 sm:grid-cols-[140px_minmax(0,1fr)]">
            <span className="text-muted-foreground">Status Sheet</span>
            <div>
              <Badge variant={sheet.hiddenAt ? "outline" : "secondary"}>
                {sheet.hiddenAt ? "Disembunyikan" : "Ditampilkan"}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border/40 bg-background">
        <div className="border-b border-border/40 px-4 py-4">
          <h2 className="text-base font-semibold">Seluruh Kolom</h2>
        </div>

        {sheet.fields.length === 0 ? (
          <EmptyState
            icon={<FileSpreadsheet size={64} strokeWidth={1.25} />}
            title="Belum ada kolom"
            description="Edit sheet ini untuk menambahkan kolom lacak."
          />
        ) : (
          <>
            <div className="hidden overflow-hidden md:block">
              <div className="grid grid-cols-[80px_220px_minmax(0,1fr)_140px_160px] items-center bg-muted/40 px-4 py-3 text-[12px] font-medium text-muted-foreground">
                <div>No</div>
                <div>Kategori</div>
                <div>Nama Kolom</div>
                <div>Tipe Kolom</div>
                <div>Isian/Pilihan</div>
              </div>
              {sheet.fields.map((field, index) => (
                <div key={field.id} className="grid grid-cols-[80px_220px_minmax(0,1fr)_140px_160px] items-center border-t border-border/40 px-4 py-3 text-sm">
                  <div className="text-muted-foreground">{index + 1}</div>
                  <div className="flex min-w-0 items-center gap-2 pr-4">
                    {field.category ? (
                      <span
                        className="size-3 shrink-0 rounded-full"
                        style={{ backgroundColor: field.categoryColor }}
                      />
                    ) : null}
                    <span className="truncate">{field.category || "Tanpa kategori"}</span>
                  </div>
                  <div className="truncate pr-4 font-medium">{field.columnName}</div>
                  <div className="text-muted-foreground">{getTypeLabel(field.type)}</div>
                  <FieldExtraBadges field={field} />
                </div>
              ))}
            </div>

            <div className="grid gap-2 p-4 md:hidden">
              {sheet.fields.map((field, index) => (
                <div key={field.id} className="rounded-lg border border-border/40 p-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-sm font-semibold">{field.columnName}</div>
                    <Badge variant="secondary">#{index + 1}</Badge>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span
                      className="inline-flex h-5 items-center gap-1.5 rounded-4xl border border-border px-2 text-xs font-medium"
                    >
                      {field.category ? (
                        <span
                          className="size-2 rounded-full"
                          style={{ backgroundColor: field.categoryColor }}
                        />
                      ) : null}
                      {field.category || "Tanpa kategori"}
                    </span>
                    <Badge variant="outline">{getTypeLabel(field.type)}</Badge>
                    <FieldExtraBadges field={field} />
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <div
        className="pointer-events-none fixed bottom-4 z-30 flex -translate-x-1/2 justify-center px-2 pb-1 transition-[left,width] duration-300 ease-in-out"
        style={{
          left: "calc(var(--topbar-left, 0px) + ((100vw - var(--topbar-left, 0px)) / 2))",
          width: "calc(100vw - var(--topbar-left, 0px) - 1rem)",
        }}
      >
        <div className="pointer-events-auto flex w-max max-w-full flex-nowrap justify-start gap-1 overflow-x-auto rounded-xl border bg-background/95 p-1.5 shadow-lg backdrop-blur sm:justify-center">
          <Button
            type="button"
            variant="action-neutral"
            size="fab-action"
            onClick={() => router.push("/admin/kelola-tabel-lacak")}
            className="shrink-0"
          >
            <ArrowLeft /> Kembali
          </Button>
          <Button
            type="button"
            variant="action-secondary"
            size="fab-action"
            onClick={() => router.push(`/admin/kelola-tabel-lacak/${encodeURIComponent(sheet.id)}/edit`)}
            className="shrink-0"
          >
            <Pencil /> Edit
          </Button>
          {sheet.hiddenAt ? (
            <Button
              type="button"
              variant="action-primary"
              size="fab-action"
              onClick={showSheet}
              disabled={showing}
              className="shrink-0"
            >
              <Eye /> {showing ? "Menampilkan" : "Tampilkan"}
            </Button>
          ) : null}
          {!sheet.hiddenAt ? (
            <>
              <Button
                type="button"
                variant="action-secondary"
                size="fab-action"
                onClick={() => deleteSheet("hide")}
                className="shrink-0"
              >
                <EyeOff /> Sembunyikan
              </Button>
              <Button
                type="button"
                variant="action-danger"
                size="fab-action"
                onClick={() => setDeleteOpen(true)}
                className="shrink-0"
              >
                <Trash2 /> Hapus
              </Button>
            </>
          ) : null}
        </div>
      </div>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="Tutup dialog"
            onClick={() => setDeleteOpen(false)}
            disabled={Boolean(deletingMode)}
            className="absolute right-3 top-3"
          >
            <X />
          </Button>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus permanen sheet lacak?</AlertDialogTitle>
            <AlertDialogDescription>
              Hapus permanen akan menghapus sheet dan seluruh kolomnya dari database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="sm:flex-wrap">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setDeleteOpen(false)}
              disabled={Boolean(deletingMode)}
            >
              Batal
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={() => deleteSheet("hard")}
              disabled={Boolean(deletingMode)}
            >
              {deletingMode === "hard" ? "Menghapus" : "Hapus Permanen"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
