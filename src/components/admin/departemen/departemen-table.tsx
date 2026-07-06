"use client"

import { Building2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { EmptyState } from "@/components/ui/empty-state"
import type { Departemen } from "@/types"

function getDisplayName(departemen: Departemen) {
  return departemen.fullName ?? departemen.tujuan
}

function DepartemenStatusBadge({ departemen }: { departemen: Departemen }) {
  return (
    <Badge variant={departemen.isActive ? "secondary" : "outline"}>
      {departemen.isActive ? "Ditampilkan" : "Disembunyikan"}
    </Badge>
  )
}

interface Props {
  departments: Departemen[]
  error?: Error
  isLoading: boolean
  onOpenDetail: (departemen: Departemen) => void
}

export function DepartemenTable({
  departments,
  error,
  isLoading,
  onOpenDetail,
}: Props) {
  if (!isLoading && departments.length === 0) {
    return (
      <div className="hidden rounded-xl border border-border/40 bg-background md:block">
        <EmptyState
          className="min-h-[320px]"
          icon={<Building2 size={64} strokeWidth={1.25} />}
          title={error ? "Gagal memuat departemen" : "Belum ada departemen"}
          description={error?.message ?? "Tambahkan departemen baru untuk mulai mengelola data."}
        />
      </div>
    )
  }

  return (
    <div className="hidden overflow-hidden rounded-xl border border-border/40 bg-background md:block">
      <div className="grid grid-cols-[120px_minmax(0,1fr)_150px_150px] border-b border-border/40 bg-muted/40 px-4 py-3 text-[12px] font-medium text-muted-foreground">
        <div>ID</div>
        <div>Nama departemen</div>
        <div>Singkatan</div>
        <div>Status</div>
      </div>

      {isLoading ? (
        Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="grid grid-cols-[120px_minmax(0,1fr)_150px_150px] items-center border-b border-border/40 px-4 py-3"
          >
            <div className="h-4 w-10 animate-pulse rounded-md bg-muted" />
            <div className="h-4 w-1/2 animate-pulse rounded-md bg-muted" />
            <div className="h-4 w-16 animate-pulse rounded-md bg-muted" />
            <div className="h-5 w-24 animate-pulse rounded-full bg-muted" />
          </div>
        ))
      ) : (
        departments.map((departemen, index) => (
          <div
            key={departemen.id}
            className="grid grid-cols-[120px_minmax(0,1fr)_150px_150px] items-center border-b border-border/40 last:border-b-0"
          >
            <div
              role="button"
              tabIndex={0}
              className="col-span-4 grid cursor-pointer grid-cols-[120px_minmax(0,1fr)_150px_150px] items-center px-4 py-3 outline-none transition-colors focus-visible:bg-muted/40"
              onClick={() => onOpenDetail(departemen)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault()
                  onOpenDetail(departemen)
                }
              }}
            >
              <div className="truncate pr-4 text-[13px] font-medium">{index + 1}</div>
              <div className="truncate pr-4 text-[13px]">{getDisplayName(departemen)}</div>
              <div className="flex items-center text-[13px] text-muted-foreground">
                <span>{departemen.shortName}</span>
              </div>
              <div>
                <DepartemenStatusBadge departemen={departemen} />
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  )
}
