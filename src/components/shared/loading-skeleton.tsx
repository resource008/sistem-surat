import { Skeleton } from "@/components/ui/skeleton"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface DataSuratSkeletonGroup {
  rowsPerGroup?: number
}

export interface DataSuratSkeletonProps {
  groups?:   DataSuratSkeletonGroup[]
  fullPage?: boolean
  className?: string
}

export interface LoadingSkeletonProps {
  type?:     "table" | "form"
  className?: string
}

// ---------------------------------------------------------------------------
// Default group config
// ---------------------------------------------------------------------------

const DEFAULT_GROUPS: DataSuratSkeletonGroup[] = [
  { rowsPerGroup: 3 },
  { rowsPerGroup: 1 },
  { rowsPerGroup: 2 },
  { rowsPerGroup: 1 },
]

// ---------------------------------------------------------------------------
// Color tokens — light: slate-200/300, dark: white/5 white/10
// Ganti semua bg-white/xx dan bg-[#0d1526] ke semantic classes
// ---------------------------------------------------------------------------

// bg kartu    → light: bg-white           dark: dark:bg-slate-900
// border      → light: border-slate-200   dark: dark:border-slate-800
// skeleton    → light: bg-slate-200       dark: dark:bg-slate-700
// skeleton dim→ light: bg-slate-100       dark: dark:bg-slate-800
// badge blue  → light: bg-blue-100        dark: dark:bg-blue-900/30

// ---------------------------------------------------------------------------
// Table skeleton internals
// ---------------------------------------------------------------------------

function RowSkeleton({ isFirst, index }: { isFirst: boolean; index: number }) {
  const perihalWidths = ["55%", "70%", "48%", "62%", "75%", "53%"]
  const perihalWidth  = perihalWidths[index % perihalWidths.length]

  return (
    <div className="flex items-center gap-3 px-4 py-3 border-t border-slate-100 dark:border-slate-800">
      <Skeleton className="h-4 w-4 rounded shrink-0 bg-slate-200 dark:bg-slate-700" />

      <div className="w-[100px] shrink-0">
        {isFirst && <Skeleton className="h-4 w-12 bg-slate-200 dark:bg-slate-700 rounded" />}
      </div>

      <div className="flex-1">
        <Skeleton
          className="h-4 bg-slate-200 dark:bg-slate-700 rounded"
          style={{ width: perihalWidth }}
        />
      </div>

      <div className="w-[120px] shrink-0 flex justify-end">
        <Skeleton className="h-4 w-16 bg-slate-200 dark:bg-slate-700 rounded" />
      </div>

      <div className="w-[80px] shrink-0 flex justify-end">
        <Skeleton className="h-4 w-10 bg-slate-200 dark:bg-slate-700 rounded" />
      </div>
    </div>
  )
}

function ColumnHeaderSkeleton() {
  return (
    <div className="flex items-center gap-3 px-4 py-2">
      <div className="w-4 shrink-0" />
      <div className="w-[100px] shrink-0">
        <Skeleton className="h-3 w-20 bg-slate-100 dark:bg-slate-800 rounded" />
      </div>
      <div className="flex-1">
        <Skeleton className="h-3 w-14 bg-slate-100 dark:bg-slate-800 rounded" />
      </div>
      <div className="w-[120px] shrink-0 flex justify-end">
        <Skeleton className="h-3 w-16 bg-slate-100 dark:bg-slate-800 rounded" />
      </div>
      <div className="w-[80px] shrink-0 flex justify-end">
        <Skeleton className="h-3 w-14 bg-slate-100 dark:bg-slate-800 rounded" />
      </div>
    </div>
  )
}

function GroupCardSkeleton({
  rowsPerGroup   = 1,
  animationDelay = 0,
}: {
  rowsPerGroup?:   number
  animationDelay?: number
}) {
  return (
    <div
      className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden animate-pulse"
      style={{ animationDelay: `${animationDelay}ms` }}
    >
      {/* Group header */}
      <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <Skeleton className="h-4 w-24 bg-slate-200 dark:bg-slate-700 rounded" />
        <Skeleton className="h-5 w-10 bg-blue-100 dark:bg-blue-900/30 rounded-full" />
      </div>

      <ColumnHeaderSkeleton />

      {Array.from({ length: rowsPerGroup }).map((_, i) => (
        <RowSkeleton key={`row-${i}`} isFirst={i === 0} index={i} />
      ))}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Form skeleton
// ---------------------------------------------------------------------------

function SuratCardSkeleton() {
  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-3 space-y-2 animate-pulse">
      <Skeleton className="h-2.5 w-20 bg-slate-100 dark:bg-slate-800 rounded" />
      <Skeleton className="h-9 w-full bg-slate-200 dark:bg-slate-700 rounded-lg" />

      <div className="flex gap-3">
        <div className="flex-1 space-y-1.5">
          <Skeleton className="h-2.5 w-20 bg-slate-100 dark:bg-slate-800 rounded" />
          <Skeleton className="h-9 w-full bg-slate-200 dark:bg-slate-700 rounded-lg" />
        </div>
        <div className="flex-1 space-y-1.5">
          <Skeleton className="h-2.5 w-16 bg-slate-100 dark:bg-slate-800 rounded" />
          <Skeleton className="h-9 w-full bg-slate-200 dark:bg-slate-700 rounded-lg" />
        </div>
      </div>

      <Skeleton className="h-2.5 w-24 bg-slate-100 dark:bg-slate-800 rounded" />
      <Skeleton className="h-9 w-full bg-slate-200 dark:bg-slate-700 rounded-lg" />
    </div>
  )
}

function FormSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={`w-full flex flex-col lg:flex-row gap-6 animate-in fade-in duration-500 ${className ?? ""}`}
    >
      {/* ── Left sidebar ── */}
      <div className="w-full lg:w-[220px] xl:w-[260px] shrink-0">
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-4 animate-pulse">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <Skeleton className="h-2.5 w-12 bg-slate-100 dark:bg-slate-800 rounded" />
              <Skeleton className="h-2.5 w-16 bg-slate-100 dark:bg-slate-800 rounded" />
            </div>
            <Skeleton className="h-5 w-10 bg-blue-100 dark:bg-blue-900/30 rounded-full" />
          </div>

          <Skeleton className="h-8 w-16 bg-slate-200 dark:bg-slate-700 rounded-lg" />
          <Skeleton className="h-px w-full bg-slate-100 dark:bg-slate-800" />

          {["Asal Surat", "Tanggal Terima", "Tujuan"].map((label, i) => (
            <div key={`filter-${label}`} className="space-y-1.5">
              <Skeleton className="h-2.5 w-20 bg-slate-100 dark:bg-slate-800 rounded" />
              <Skeleton className="h-9 w-full bg-slate-200 dark:bg-slate-700 rounded-xl" />
            </div>
          ))}
        </div>
      </div>

      {/* ── Right content ── */}
      <div className="flex-1 min-w-0 space-y-3">
        {[1, 2, 3].map((idx) => (
          <SuratCardSkeleton key={`card-${idx}`} />
        ))}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// DataSuratSkeleton
// ---------------------------------------------------------------------------

export function DataSuratSkeleton({
  groups   = DEFAULT_GROUPS,
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
    <div className={`w-full min-h-screen bg-slate-50 dark:bg-slate-950 ${className ?? ""}`}>
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
        <Skeleton className="h-5 w-24 bg-slate-200 dark:bg-slate-700 rounded" />
        <div className="flex gap-2">
          <Skeleton className="h-8 w-28 bg-slate-200 dark:bg-slate-700 rounded-lg" />
          <Skeleton className="h-8 w-20 bg-slate-200 dark:bg-slate-700 rounded-lg" />
        </div>
      </div>
      <div className="p-6">{cards}</div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// LoadingSkeleton — shared entry point
// ---------------------------------------------------------------------------

export function LoadingSkeleton({ type = "table", className }: LoadingSkeletonProps) {
  if (type === "form") return <FormSkeleton className={className} />
  return <DataSuratSkeleton className={className} />
}