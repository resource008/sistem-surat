"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import useSWR from "swr"
import { toast } from "sonner"
import { ArrowLeft, Eye, EyeOff, FileSpreadsheet, Pencil, Trash2 } from "lucide-react"
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
import { getTrackCategoryStyle } from "@/lib/track-category-color"
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

function getPermissionLabel(field: TrackField) {
  if (isDefaultIdField(field)) return "Sistem"
  return field.fillByHrd ? "User lihat, HRD edit" : "User edit, HRD lihat"
}

function FieldExtraBadges({ field, className = "" }: { field: TrackField; className?: string }) {
  return (
    <div className={`flex flex-wrap items-center gap-1 ${className}`}>
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
  const [deleting, setDeleting] = useState(false)
  const [visibilityAction, setVisibilityAction] = useState<"show" | "hide" | null>(null)

  useEffect(() => {
    window.dispatchEvent(new CustomEvent("breadcrumb:sub", { detail: "Detail Sheet Lacak" }))
    return () => {
      window.dispatchEvent(new CustomEvent("breadcrumb:sub", { detail: null }))
    }
  }, [])

  async function deleteSheet() {
    if (!sheet) return
    setDeleting(true)

    try {
      const res = await fetch(`/api/admin/track-table/${encodeURIComponent(sheet.id)}`, {
        method: "DELETE",
      })
      const json = await res.json().catch(() => null)

      if (!res.ok) {
        throw new Error(json?.error ?? "Gagal memproses sheet lacak")
      }

      toast.success(json?.message ?? "Data sheet lacak berhasil dihapus permanen")
      router.push("/admin/lacak-surat")
    } catch (err) {
      toast.error(getErrorMessage(err, "Gagal memproses sheet lacak"))
    } finally {
      setDeleting(false)
    }
  }

  if (isLoading) {
    return <TrackTableDetailSkeleton />
  }

  async function setSheetVisibility(action: "show" | "hide") {
    if (!sheet) return
    setVisibilityAction(action)

    try {
      const res = await fetch(`/api/admin/track-table/${encodeURIComponent(sheet.id)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      })
      const json = await res.json().catch(() => null)

      if (!res.ok) {
        throw new Error(json?.error ?? json?.message ?? "Gagal mengubah status sheet lacak")
      }

      toast.success(json?.message ?? (
        action === "show" ? "Sheet lacak berhasil ditampilkan" : "Data sheet lacak berhasil disembunyikan"
      ))
      await mutate()
    } catch (err) {
      toast.error(getErrorMessage(err, "Gagal mengubah status sheet lacak"))
    } finally {
      setVisibilityAction(null)
    }
  }

  if (error || !sheet) {
    return (
      <div className="flex min-h-[360px] flex-col items-center justify-center gap-3">
        <p className="text-sm text-muted-foreground">{error?.message ?? "Sheet lacak tidak ditemukan"}</p>
        <Button variant="outline" onClick={() => router.push("/admin/lacak-surat")}>
          Kembali
        </Button>
      </div>
    )
  }

  const hrdFieldsCount = sheet.fields.filter((field) => field.fillByHrd).length

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
            <span className="text-muted-foreground">Izin HRD</span>
            <div>
              <Badge variant={hrdFieldsCount > 0 ? "secondary" : "outline"}>
                {hrdFieldsCount} kolom
              </Badge>
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
          <div>
            <h2 className="text-base font-semibold">Seluruh Kolom</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Daftar kolom, kategori, tipe data, dan mode izin pengisian.
            </p>
          </div>
        </div>

        {sheet.fields.length === 0 ? (
          <EmptyState
            icon={<FileSpreadsheet size={64} strokeWidth={1.25} />}
            title="Belum ada kolom"
            description="Edit sheet ini untuk menambahkan kolom lacak."
          />
        ) : (
          <>
            <div className="overflow-x-auto">
              <div className="grid min-w-[1080px] grid-cols-[56px_minmax(180px,1.2fr)_200px_120px_minmax(190px,0.9fr)_minmax(180px,1fr)] items-center bg-muted/40 px-4 py-3 text-[12px] font-medium text-muted-foreground">
                <div>No</div>
                <div>Nama Kolom</div>
                <div>Kategori</div>
                <div>Tipe Kolom</div>
                <div>Izin</div>
                <div>Isian/Pilihan</div>
              </div>
              {sheet.fields.map((field, index) => (
                <div key={field.id} className="grid min-w-[1080px] grid-cols-[56px_minmax(180px,1.2fr)_200px_120px_minmax(190px,0.9fr)_minmax(180px,1fr)] items-center border-t border-border/40 px-4 py-3 text-sm transition-colors hover:bg-muted/20">
                  <div>
                    <span className="inline-flex size-7 items-center justify-center rounded-md bg-muted text-xs font-semibold text-muted-foreground">
                      {index + 1}
                    </span>
                  </div>
                  <div className="min-w-0 pr-4">
                    <div className="flex min-w-0 flex-wrap items-center gap-2">
                      <span className="truncate font-semibold">{field.columnName}</span>
                      {field.hiddenAt ? <Badge variant="outline">Disembunyikan</Badge> : null}
                    </div>
                    <div className="mt-0.5 truncate text-xs text-muted-foreground">{field.region || "Global"}</div>
                  </div>
                  <div className="min-w-0 pr-4">
                    {field.category ? (
                      <span
                        className="inline-flex max-w-full items-center rounded-md border px-2 py-1 text-xs font-semibold"
                        style={getTrackCategoryStyle(field.categoryColor)}
                      >
                        <span className="truncate">{field.category}</span>
                      </span>
                    ) : (
                      <span className="truncate text-muted-foreground">Tanpa kategori</span>
                    )}
                  </div>
                  <div>
                    <Badge variant="outline">{getTypeLabel(field.type)}</Badge>
                  </div>
                  <div>
                    <Badge
                      variant={field.fillByHrd ? "secondary" : "outline"}
                      className={field.fillByHrd ? "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300" : "text-muted-foreground"}
                    >
                      {getPermissionLabel(field)}
                    </Badge>
                  </div>
                  <FieldExtraBadges field={field} className="pr-2" />
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
            onClick={() => router.push("/admin/lacak-surat")}
            className="shrink-0"
          >
            <ArrowLeft /> Kembali
          </Button>
          <Button
            type="button"
            variant="action-secondary"
            size="fab-action"
            onClick={() => router.push(`/admin/lacak-surat/${encodeURIComponent(sheet.id)}/edit`)}
            className="shrink-0"
          >
            <Pencil /> Edit
          </Button>
          {sheet.hiddenAt ? (
            <Button
              type="button"
              variant="action-primary"
              size="fab-action"
              onClick={() => setSheetVisibility("show")}
              disabled={Boolean(visibilityAction)}
              className="shrink-0"
            >
              <Eye /> {visibilityAction === "show" ? "Menampilkan" : "Tampilkan"}
            </Button>
          ) : null}
          {!sheet.hiddenAt ? (
            <>
              <Button
                type="button"
                variant="action-secondary"
                size="fab-action"
                onClick={() => setSheetVisibility("hide")}
                disabled={Boolean(visibilityAction)}
                className="shrink-0"
              >
                <EyeOff /> {visibilityAction === "hide" ? "Menyembunyikan" : "Sembunyikan"}
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
              disabled={deleting}
            >
              Batal
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={deleteSheet}
              disabled={deleting}
            >
              {deleting ? "Menghapus" : "Hapus Permanen"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
