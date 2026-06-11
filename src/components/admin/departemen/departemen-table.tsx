"use client"

import { Building2, Edit2, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/ui/empty-state"
import type { Departemen } from "@/types"

interface Props {
  departments: Departemen[]
  error?: Error
  isLoading: boolean
  onEdit: (departemen: Departemen) => void
  onDelete: (departemen: Departemen) => void
}

export function DepartemenTable({
  departments,
  error,
  isLoading,
  onEdit,
  onDelete,
}: Props) {
  if (!isLoading && departments.length === 0) {
    return (
      <div className="hidden rounded-xl border border-border/50 bg-background md:block">
        <EmptyState
          icon={<Building2 size={120} strokeWidth={1} />}
          title={error ? "Gagal memuat departemen" : "Belum ada departemen"}
          description={error?.message ?? "Tambahkan departemen baru untuk mulai mengelola data."}
        />
      </div>
    )
  }

  return (
    <div className="hidden overflow-hidden rounded-xl border border-border/50 bg-background md:block">
      <div className="grid grid-cols-[minmax(0,1fr)_180px_140px] border-b border-border bg-muted/40 px-4 py-3 text-xs font-medium text-muted-foreground">
        <div>Nama Departemen</div>
        <div>Singkatan</div>
        <div className="text-right">Aksi</div>
      </div>

      {isLoading ? (
        Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="grid grid-cols-[minmax(0,1fr)_180px_140px] items-center border-b border-border px-4 py-3"
          >
            <div className="h-4 w-1/2 animate-pulse rounded-md bg-muted" />
            <div className="h-4 w-16 animate-pulse rounded-md bg-muted" />
            <div className="ml-auto h-8 w-24 animate-pulse rounded-lg bg-muted" />
          </div>
        ))
      ) : (
        departments.map((departemen) => (
          <div
            key={departemen.id}
            className="grid grid-cols-[minmax(0,1fr)_180px_140px] items-center border-b border-border px-4 py-3 last:border-b-0"
          >
            <div className="truncate text-sm font-medium">{departemen.tujuan}</div>
            <div className="text-sm text-muted-foreground">{departemen.shortName}</div>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                size="icon-sm"
                onClick={() => onEdit(departemen)}
                title="Edit departemen"
              >
                <Edit2 className="size-3.5" />
              </Button>
              <Button
                type="button"
                variant="destructive"
                size="icon-sm"
                onClick={() => onDelete(departemen)}
                title="Hapus departemen"
              >
                <Trash2 className="size-3.5" />
              </Button>
            </div>
          </div>
        ))
      )}
    </div>
  )
}
