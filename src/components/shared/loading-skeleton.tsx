import { Skeleton } from "@/components/ui/skeleton"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface DataSuratSkeletonGroup {
  rowsPerGroup?: number
}

export interface DataSuratSkeletonProps {
  groups?: DataSuratSkeletonGroup[]
  /** Render the full-page shell (top bar + page background). Default: false */
  fullPage?: boolean
  className?: string
}

export interface LoadingSkeletonProps {
  /**
   * "table" → Data Surat list skeleton (default)
   * "form"  → Edit Surat form skeleton (sidebar + content panels)
   */
  type?: "table" | "form"
  className?: string
}

// ---------------------------------------------------------------------------
// Default group config — mirrors the Data Surat screenshot
// ---------------------------------------------------------------------------

const DEFAULT_GROUPS: DataSuratSkeletonGroup[] = [
  { rowsPerGroup: 3 },
  { rowsPerGroup: 1 },
  { rowsPerGroup: 2 },
  { rowsPerGroup: 1 },
]

// ---------------------------------------------------------------------------
// Table skeleton internals
// ---------------------------------------------------------------------------

function RowSkeleton({ isFirst, index }: { isFirst: boolean; index: number }) {
  const perihalWidths = ["55%", "70%", "48%", "62%", "75%", "53%"]
  const perihalWidth = perihalWidths[index % perihalWidths.length]

  return (
    <div className="flex items-center gap-3 px-4 py-3 border-t border-white/5">
      <Skeleton className="h-4 w-4 rounded shrink-0 bg-white/10" />

      <div className="w-[100px] shrink-0">
        {isFirst && <Skeleton className="h-4 w-12 bg-white/10 rounded" />}
      </div>

      <div className="flex-1">
        <Skeleton className="h-4 bg-white/10 rounded" style={{ width: perihalWidth }} />
      </div>

      <div className="w-[120px] shrink-0 flex justify-end">
        <Skeleton className="h-4 w-16 bg-white/10 rounded" />
      </div>

      <div className="w-[80px] shrink-0 flex justify-end">
        <Skeleton className="h-4 w-10 bg-white/10 rounded" />
      </div>
    </div>
  )
}

function ColumnHeaderSkeleton() {
  return (
    <div className="flex items-center gap-3 px-4 py-2">
      <div className="w-4 shrink-0" />
      <div className="w-[100px] shrink-0">
        <Skeleton className="h-3 w-20 bg-white/5 rounded" />
      </div>
      <div className="flex-1">
        <Skeleton className="h-3 w-14 bg-white/5 rounded" />
      </div>
      <div className="w-[120px] shrink-0 flex justify-end">
        <Skeleton className="h-3 w-16 bg-white/5 rounded" />
      </div>
      <div className="w-[80px] shrink-0 flex justify-end">
        <Skeleton className="h-3 w-14 bg-white/5 rounded" />
      </div>
    </div>
  )
}

function GroupCardSkeleton({
  rowsPerGroup = 1,
  animationDelay = 0,
}: {
  rowsPerGroup?: number
  animationDelay?: number
}) {
  return (
    <div
      className="rounded-xl border border-white/10 bg-[#0d1526] overflow-hidden animate-pulse"
      style={{ animationDelay: `${animationDelay}ms` }}
    >
      <div className="flex items-center gap-3 px-4 py-3">
        <Skeleton className="h-4 w-24 bg-white/10 rounded" />
        <Skeleton className="h-5 w-10 bg-blue-500/20 rounded-full" />
      </div>

      <ColumnHeaderSkeleton />

      {Array.from({ length: rowsPerGroup }).map((_, i) => (
        <RowSkeleton key={i} isFirst={i === 0} index={i} />
      ))}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Form skeleton
// Matches EditSuratPage layout exactly — no extra px, parent handles padding.
// Left: fixed-width sidebar. Right: flex-1 fills all remaining space.
// ---------------------------------------------------------------------------

function SuratCardSkeleton() {
  return (
    <div className="rounded-xl border border-white/5 bg-white/[0.03] p-3 space-y-2 animate-pulse">
      {/* Perihal Surat */}
      <Skeleton className="h-2.5 w-20 bg-white/5 rounded" />
      <Skeleton className="h-9 w-full bg-white/10 rounded-lg" />

      {/* Nomor Surat + Lampiran */}
      <div className="flex gap-3">
        <div className="flex-1 space-y-1.5">
          <Skeleton className="h-2.5 w-20 bg-white/5 rounded" />
          <Skeleton className="h-9 w-full bg-white/10 rounded-lg" />
        </div>
        <div className="flex-1 space-y-1.5">
          <Skeleton className="h-2.5 w-16 bg-white/5 rounded" />
          <Skeleton className="h-9 w-full bg-white/10 rounded-lg" />
        </div>
      </div>

      {/* Tanggal Surat */}
      <Skeleton className="h-2.5 w-24 bg-white/5 rounded" />
      <Skeleton className="h-9 w-full bg-white/10 rounded-lg" />
    </div>
  )
}

function FormSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={[
        // No px — inherits from EditSuratPage wrapper (px-4 xl:px-0)
        // max-w-7xl is set by EditSuratPage, not here
        "w-full flex flex-col lg:flex-row gap-6",
        "animate-in fade-in duration-500",
        className ?? "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {/* ── Left sidebar: RegisterInfoPanel ── */}
      <div className="w-full lg:w-[220px] xl:w-[260px] shrink-0">
        <div className="rounded-2xl border border-white/10 bg-[#0d1526] p-4 space-y-4 animate-pulse">
          {/* "NOMOR REGISTER" label + department badge */}
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <Skeleton className="h-2.5 w-12 bg-white/5 rounded" />
              <Skeleton className="h-2.5 w-16 bg-white/5 rounded" />
            </div>
            <Skeleton className="h-5 w-10 bg-blue-500/20 rounded-full" />
          </div>

          {/* Big nomor */}
          <Skeleton className="h-8 w-16 bg-white/15 rounded-lg" />

          <Skeleton className="h-px w-full bg-white/5" />

          {/* Asal Surat */}
          <div className="space-y-1.5">
            <Skeleton className="h-2.5 w-16 bg-white/5 rounded" />
            <Skeleton className="h-9 w-full bg-white/10 rounded-xl" />
          </div>

          {/* Tanggal Terima */}
          <div className="space-y-1.5">
            <Skeleton className="h-2.5 w-20 bg-white/5 rounded" />
            <Skeleton className="h-9 w-full bg-white/10 rounded-xl" />
          </div>

          {/* Tujuan */}
          <div className="space-y-1.5">
            <Skeleton className="h-2.5 w-12 bg-white/5 rounded" />
            <Skeleton className="h-9 w-full bg-white/10 rounded-xl" />
          </div>
        </div>
      </div>

      {/* ── Right content: SuratListPanel / PIListPanel ──
          flex-1 + min-w-0 → fills ALL remaining width, no overflow */}
      <div className="flex-1 min-w-0 space-y-3">
        {[1, 2, 3].map((i) => (
          <SuratCardSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// DataSuratSkeleton — table variant with optional full-page shell
// ---------------------------------------------------------------------------

export function DataSuratSkeleton({
  groups = DEFAULT_GROUPS,
  fullPage = false,
  className,
}: DataSuratSkeletonProps) {
  const cards = (
    <div className="flex flex-col gap-4 animate-in fade-in duration-500">
      {groups.map((group, i) => (
        <GroupCardSkeleton
          key={i}
          rowsPerGroup={group.rowsPerGroup}
          animationDelay={i * 80}
        />
      ))}
    </div>
  )

  if (!fullPage) {
    return <div className={className}>{cards}</div>
  }

  return (
    <div className={`w-full min-h-screen bg-[#080f1e] ${className ?? ""}`}>
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
        <Skeleton className="h-5 w-24 bg-white/10 rounded" />
        <div className="flex gap-2">
          <Skeleton className="h-8 w-28 bg-white/10 rounded-lg" />
          <Skeleton className="h-8 w-20 bg-white/10 rounded-lg" />
        </div>
      </div>
      <div className="p-6">{cards}</div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// LoadingSkeleton — shared entry point used across the app
//
// Usage:
//   <LoadingSkeleton />              → table (Data Surat list)
//   <LoadingSkeleton type="form" />  → form (Edit Surat page)
// ---------------------------------------------------------------------------

export function LoadingSkeleton({ type = "table", className }: LoadingSkeletonProps) {
  if (type === "form") {
    return <FormSkeleton className={className} />
  }

  return <DataSuratSkeleton className={className} />
}