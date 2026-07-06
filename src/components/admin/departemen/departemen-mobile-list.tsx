"use client"

import { Building2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { EmptyState } from "@/components/ui/empty-state"
import { Skeleton } from "@/components/ui/skeleton"
import type { Departemen } from "@/types"

function getDisplayName(departemen: Departemen) {
  return departemen.fullName ?? departemen.tujuan
}

function DepartemenStatusBadge({ departemen }: { departemen: Departemen }) {
  const isActive = departemen.isActive !== false

  return (
    <Badge variant={isActive ? "secondary" : "outline"}>
      {isActive ? "Ditampilkan" : "Disembunyikan"}
    </Badge>
  )
}

interface Props {
  departments: Departemen[]
  error?: Error
  isLoading: boolean
  onOpenDetail: (departemen: Departemen) => void
}

export function DepartemenMobileList({
  departments,
  error,
  isLoading,
  onOpenDetail,
}: Props) {
  return (
    <div className="flex flex-col gap-3 md:hidden">
      {isLoading ? (
        Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-border/40 p-4">
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="mt-3 h-3 w-20" />
            <Skeleton className="mt-3 h-5 w-24 rounded-full" />
          </div>
        ))
      ) : departments.length === 0 ? (
        <div className="rounded-xl border border-border/40">
          <EmptyState
            className="px-4"
            icon={<Building2 size={64} strokeWidth={1.25} />}
            title={error ? "Gagal memuat departemen" : "Belum ada departemen"}
            description={error?.message ?? "Tambahkan departemen baru untuk mulai mengelola data."}
          />
        </div>
      ) : (
        departments.map((departemen, index) => {
          return (
            <div key={departemen.id} className="rounded-xl border border-border/40">
              <div
                role="button"
                tabIndex={0}
                className="flex cursor-pointer items-start justify-between gap-3 p-4 outline-none transition-colors focus-visible:bg-muted/40"
                onClick={() => onOpenDetail(departemen)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault()
                    onOpenDetail(departemen)
                  }
                }}
              >
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold">{index + 1}</div>
                  <div className="mt-1 truncate text-sm">{getDisplayName(departemen)}</div>
                  <div className="mt-1 text-xs text-muted-foreground">{departemen.shortName}</div>
                  <div className="mt-3">
                    <DepartemenStatusBadge departemen={departemen} />
                  </div>
                </div>
              </div>
            </div>
          )
        })
      )}
    </div>
  )
}
