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

export function DepartemenMobileList({
  departments,
  error,
  isLoading,
  onEdit,
  onDelete,
}: Props) {
  return (
    <div className="flex flex-col gap-3 md:hidden">
      {isLoading ? (
        Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-border/50 p-4">
            <div className="h-4 w-1/2 animate-pulse rounded-md bg-muted" />
            <div className="mt-3 h-3 w-20 animate-pulse rounded-md bg-muted" />
          </div>
        ))
      ) : departments.length === 0 ? (
        <div className="rounded-xl border border-border/50">
          <EmptyState
            icon={<Building2 size={120} strokeWidth={1} />}
            title={error ? "Gagal memuat departemen" : "Belum ada departemen"}
            description={error?.message ?? "Tambahkan departemen baru untuk mulai mengelola data."}
          />
        </div>
      ) : (
        departments.map((departemen) => (
          <div key={departemen.id} className="rounded-xl border border-border/50 p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold">{departemen.tujuan}</div>
                <div className="mt-1 text-xs text-muted-foreground">{departemen.shortName}</div>
              </div>
              <div className="flex shrink-0 gap-2">
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
          </div>
        ))
      )}
    </div>
  )
}
