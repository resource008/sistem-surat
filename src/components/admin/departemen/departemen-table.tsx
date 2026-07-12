"use client"

import { useEffect, useState } from "react"
import { Building2, ChevronLeft, ChevronRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/ui/empty-state"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import type { Departemen } from "@/types"

const DEPARTMENTS_PER_PAGE = 10
const tableGridClass = [
  "grid min-w-[560px]",
  "grid-cols-[70px_minmax(190px,1fr)_130px_140px]",
  "md:min-w-[640px]",
  "md:grid-cols-[90px_minmax(240px,1fr)_150px_150px]",
].join(" ")
const mobileCardClass = [
  "w-full rounded-xl border border-border/40 bg-background p-4 text-left",
  "outline-none transition-colors active:bg-muted/40",
  "focus-visible:bg-muted/40 focus-visible:ring-2 focus-visible:ring-ring/40",
].join(" ")
const paginationClass = [
  "flex flex-col gap-3 rounded-xl border border-border/40 bg-background px-4 py-3",
  "sm:flex-row sm:items-center sm:justify-between",
].join(" ")

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

export function DepartemenTable({
  departments,
  error,
  isLoading,
  onOpenDetail,
}: Props) {
  const [currentPage, setCurrentPage] = useState(1)
  const totalPages = Math.max(1, Math.ceil(departments.length / DEPARTMENTS_PER_PAGE))
  const pageStartIndex = (currentPage - 1) * DEPARTMENTS_PER_PAGE
  const pageEndIndex = Math.min(departments.length, pageStartIndex + DEPARTMENTS_PER_PAGE)
  const paginatedDepartments = departments.slice(pageStartIndex, pageEndIndex)
  const showPagination = departments.length > DEPARTMENTS_PER_PAGE

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages)
    }
  }, [currentPage, totalPages])

  if (!isLoading && departments.length === 0) {
    return (
      <div className="rounded-xl border border-border/40 bg-background">
        <EmptyState
          icon={<Building2 size={64} strokeWidth={1.25} />}
          title={error ? "Gagal memuat departemen" : "Belum ada departemen"}
          description={error?.message ?? "Tambahkan departemen baru untuk mulai mengelola data."}
        />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-3 md:hidden">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-border/40 bg-background p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <Skeleton className="h-3 w-12" />
                  <Skeleton className="mt-3 h-4 w-3/4" />
                  <Skeleton className="mt-3 h-3 w-16" />
                </div>
                <Skeleton className="h-6 w-24 rounded-full" />
              </div>
            </div>
          ))
        ) : (
          paginatedDepartments.map((departemen, pageIndex) => (
            <button
              key={departemen.id}
              type="button"
              className={mobileCardClass}
              onClick={() => onOpenDetail(departemen)}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-xs font-medium text-muted-foreground">
                    No. {pageStartIndex + pageIndex + 1}
                  </div>
                  <div className="mt-2 truncate text-sm font-semibold">
                    {getDisplayName(departemen)}
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    Singkatan: <span className="font-medium text-foreground">{departemen.shortName}</span>
                  </div>
                </div>
                <div className="shrink-0">
                  <DepartemenStatusBadge departemen={departemen} />
                </div>
              </div>
            </button>
          ))
        )}
      </div>

      <div className="hidden overflow-hidden rounded-xl border border-border/40 bg-background md:block">
        <div className="overflow-x-auto">
          <div
            className={cn(
              tableGridClass,
              "border-b border-border/40 bg-muted/40 px-4 py-3 text-[12px] font-medium text-muted-foreground"
            )}
          >
            <div>No.</div>
            <div>Nama departemen</div>
            <div>Singkatan</div>
            <div>Status</div>
          </div>

          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className={cn(
                  tableGridClass,
                  "items-center border-b border-border/40 px-4 py-3 last:border-b-0"
                )}
              >
                <Skeleton className="h-4 w-10" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-5 w-24 rounded-full" />
              </div>
            ))
          ) : (
            paginatedDepartments.map((departemen, pageIndex) => (
              <div
                key={departemen.id}
                role="button"
                tabIndex={0}
                className={cn(
                  tableGridClass,
                  "cursor-pointer items-center border-b border-border/40 px-4 py-3",
                  "outline-none transition-colors last:border-b-0",
                  "hover:bg-muted/30 focus-visible:bg-muted/40"
                )}
                onClick={() => onOpenDetail(departemen)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault()
                    onOpenDetail(departemen)
                  }
                }}
              >
                <div className="truncate pr-4 text-[13px] font-medium">{pageStartIndex + pageIndex + 1}</div>
                <div className="truncate pr-4 text-[13px]">{getDisplayName(departemen)}</div>
                <div className="flex items-center text-[13px] text-muted-foreground">
                  <span>{departemen.shortName}</span>
                </div>
                <div>
                  <DepartemenStatusBadge departemen={departemen} />
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {showPagination ? (
        <div className={paginationClass}>
          <p className="text-sm text-muted-foreground">
            Menampilkan {pageStartIndex + 1}-{pageEndIndex} dari {departments.length} departemen
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
    </div>
  )
}
