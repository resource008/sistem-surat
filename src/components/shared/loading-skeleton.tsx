import { Skeleton } from "@/components/ui/skeleton"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface DataSuratSkeletonGroup {
  rowsPerGroup?: number
}

export interface DataSuratSkeletonProps {
  groups?: DataSuratSkeletonGroup[]
  fullPage?: boolean
  className?: string
}

export interface LoadingSkeletonProps {
  type?: "table" | "form" | "profile" | "departemen-form"
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
// Style helpers — semua warna pakai CSS variable, otomatis ikut tema
// ---------------------------------------------------------------------------

const sk: Record<string, React.CSSProperties> = {
  base:    { background: "var(--sk-base)"     },
  subtle:  { background: "var(--sk-subtle)"   },
  badge:   { background: "var(--sk-badge)"    },
  card:    { background: "var(--sk-card)"     },
  border:  { borderColor: "var(--sk-border)"  },
  divider: { borderColor: "var(--sk-divider)" },
  page:    { background: "var(--sk-page)"     },
}

// ---------------------------------------------------------------------------
// Table skeleton internals
// ---------------------------------------------------------------------------

function RowSkeleton({ isFirst, index }: { isFirst: boolean; index: number }) {
  const perihalWidths = ["55%", "70%", "48%", "62%", "75%", "53%"]
  const perihalWidth = perihalWidths[index % perihalWidths.length]

  return (
    <div className="flex items-center gap-3 px-4 py-3 border-t" style={sk.divider}>
      <Skeleton className="h-4 w-4 rounded shrink-0" style={sk.base} />

      <div className="w-[100px] shrink-0">
        {isFirst && <Skeleton className="h-4 w-12 rounded" style={sk.base} />}
      </div>

      <div className="flex-1">
        <Skeleton className="h-4 rounded" style={{ ...sk.base, width: perihalWidth }} />
      </div>

      <div className="w-[120px] shrink-0 flex justify-end">
        <Skeleton className="h-4 w-16 rounded" style={sk.base} />
      </div>

      <div className="w-[80px] shrink-0 flex justify-end">
        <Skeleton className="h-4 w-10 rounded" style={sk.base} />
      </div>
    </div>
  )
}

function ColumnHeaderSkeleton() {
  return (
    <div className="flex items-center gap-3 px-4 py-2">
      <div className="w-4 shrink-0" />
      <div className="w-[100px] shrink-0">
        <Skeleton className="h-3 w-20 rounded" style={sk.subtle} />
      </div>
      <div className="flex-1">
        <Skeleton className="h-3 w-14 rounded" style={sk.subtle} />
      </div>
      <div className="w-[120px] shrink-0 flex justify-end">
        <Skeleton className="h-3 w-16 rounded" style={sk.subtle} />
      </div>
      <div className="w-[80px] shrink-0 flex justify-end">
        <Skeleton className="h-3 w-14 rounded" style={sk.subtle} />
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
      className="rounded-xl border overflow-hidden animate-pulse"
      style={{ ...sk.card, ...sk.border, animationDelay: `${animationDelay}ms` }}
    >
      <div className="flex items-center gap-3 px-4 py-3">
        <Skeleton className="h-4 w-24 rounded" style={sk.base} />
        <Skeleton className="h-5 w-10 rounded-full" style={sk.badge} />
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
// ---------------------------------------------------------------------------

function SuratCardSkeleton() {
  return (
    <div
      className="rounded-xl border p-3 space-y-2 animate-pulse"
      style={{ ...sk.subtle, ...sk.border }}
    >
      <Skeleton className="h-2.5 w-20 rounded" style={sk.subtle} />
      <Skeleton className="h-9 w-full rounded-lg" style={sk.base} />

      <div className="flex gap-3">
        <div className="flex-1 space-y-1.5">
          <Skeleton className="h-2.5 w-20 rounded" style={sk.subtle} />
          <Skeleton className="h-9 w-full rounded-lg" style={sk.base} />
        </div>
        <div className="flex-1 space-y-1.5">
          <Skeleton className="h-2.5 w-16 rounded" style={sk.subtle} />
          <Skeleton className="h-9 w-full rounded-lg" style={sk.base} />
        </div>
      </div>

      <Skeleton className="h-2.5 w-24 rounded" style={sk.subtle} />
      <Skeleton className="h-9 w-full rounded-lg" style={sk.base} />
    </div>
  )
}

function FormSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={[
        "w-full flex flex-col lg:flex-row gap-6",
        "animate-in fade-in duration-500",
        className ?? "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {/* ── Left sidebar ── */}
      <div className="w-full lg:w-[220px] xl:w-[260px] shrink-0">
        <div
          className="rounded-2xl border p-4 space-y-4 animate-pulse"
          style={{ ...sk.card, ...sk.border }}
        >
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <Skeleton className="h-2.5 w-12 rounded" style={sk.subtle} />
              <Skeleton className="h-2.5 w-16 rounded" style={sk.subtle} />
            </div>
            <Skeleton className="h-5 w-10 rounded-full" style={sk.badge} />
          </div>

          <Skeleton className="h-8 w-16 rounded-lg" style={sk.base} />

          <Skeleton className="h-px w-full" style={sk.subtle} />

          <div className="space-y-1.5">
            <Skeleton className="h-2.5 w-16 rounded" style={sk.subtle} />
            <Skeleton className="h-9 w-full rounded-xl" style={sk.base} />
          </div>
          <div className="space-y-1.5">
            <Skeleton className="h-2.5 w-20 rounded" style={sk.subtle} />
            <Skeleton className="h-9 w-full rounded-xl" style={sk.base} />
          </div>
          <div className="space-y-1.5">
            <Skeleton className="h-2.5 w-12 rounded" style={sk.subtle} />
            <Skeleton className="h-9 w-full rounded-xl" style={sk.base} />
          </div>
        </div>
      </div>

      {/* ── Right content ── */}
      <div className="flex-1 min-w-0 space-y-3">
        {[1, 2, 3].map((i) => (
          <SuratCardSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}

function FieldGridSkeleton({ rows = 2 }: { rows?: number }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {Array.from({ length: rows * 2 }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-3 w-24 rounded" style={sk.subtle} />
          <Skeleton className="h-10 w-full rounded-xl" style={sk.base} />
        </div>
      ))}
    </div>
  )
}

export function ProfileSkeleton({ className }: { className?: string }) {
  return (
    <div className={`flex flex-col gap-4 pb-24 ${className ?? ""}`}>
      <div className="overflow-hidden rounded-2xl border animate-pulse" style={{ ...sk.card, ...sk.border }}>
        <div className="flex items-center gap-2.5 border-b px-6 py-4" style={sk.border}>
          <Skeleton className="size-4 rounded" style={sk.subtle} />
          <Skeleton className="h-4 w-24 rounded" style={sk.base} />
        </div>

        <div className="flex flex-col gap-6 px-6 py-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Skeleton className="size-10 rounded-xl" style={sk.base} />
              <div className="space-y-2">
                <Skeleton className="h-4 w-32 rounded" style={sk.base} />
                <Skeleton className="h-3 w-16 rounded" style={sk.subtle} />
              </div>
            </div>
            <div className="hidden grid-cols-2 gap-6 sm:grid">
              {[1, 2].map((item) => (
                <div key={item} className="space-y-2">
                  <Skeleton className="ml-auto h-3 w-16 rounded" style={sk.subtle} />
                  <Skeleton className="ml-auto h-4 w-24 rounded" style={sk.base} />
                  <Skeleton className="ml-auto h-3 w-12 rounded" style={sk.subtle} />
                </div>
              ))}
            </div>
          </div>

          <FieldGridSkeleton />
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border animate-pulse" style={{ ...sk.card, ...sk.border }}>
        <div className="flex items-center gap-2.5 border-b px-6 py-4" style={sk.border}>
          <Skeleton className="size-4 rounded" style={sk.subtle} />
          <Skeleton className="h-4 w-20 rounded" style={sk.base} />
        </div>
        <div className="px-6 py-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between border-b py-3 last:border-0" style={sk.divider}>
              <Skeleton className="h-4 w-36 rounded" style={sk.subtle} />
              <Skeleton className="h-6 w-16 rounded-full" style={sk.badge} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function DepartemenPanelSkeleton({
  rows = 3,
  compact = false,
}: {
  rows?: number
  compact?: boolean
}) {
  return (
    <div className="overflow-hidden rounded-xl border animate-pulse" style={{ ...sk.card, ...sk.border }}>
      <div className="flex items-center gap-3 border-b px-5 py-4" style={sk.border}>
        <Skeleton className="size-9 rounded-xl" style={sk.subtle} />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-40 rounded" style={sk.base} />
          <Skeleton className="h-3 w-56 max-w-full rounded" style={sk.subtle} />
        </div>
        <Skeleton className="size-4 rounded" style={sk.subtle} />
      </div>
      <div className="space-y-4 p-5">
        {Array.from({ length: rows }).map((_, i) => (
          <div
            key={i}
            className={compact ? "grid grid-cols-[130px_minmax(0,1fr)] items-center gap-4" : "space-y-2"}
          >
            <Skeleton className="h-3 w-28 rounded" style={sk.subtle} />
            <Skeleton className="h-10 w-full rounded-xl" style={sk.base} />
          </div>
        ))}
      </div>
    </div>
  )
}

export function DepartemenFormSkeleton({ className }: { className?: string }) {
  return (
    <div className={`flex flex-col gap-4 pb-28 ${className ?? ""}`}>
      <div className="rounded-xl border p-5 animate-pulse" style={{ ...sk.card, ...sk.border }}>
        <FieldGridSkeleton rows={1} />
      </div>
      <DepartemenPanelSkeleton rows={4} compact />
      <DepartemenPanelSkeleton rows={5} compact />
      <DepartemenPanelSkeleton rows={1} />
    </div>
  )
}

export function DataSuratMoreSkeleton({ rows = 2, className }: { rows?: number; className?: string }) {
  return (
    <div className={`w-full ${className ?? ""}`}>
      <GroupCardSkeleton rowsPerGroup={rows} />
    </div>
  )
}

// ---------------------------------------------------------------------------
// DataSuratSkeleton
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
    return <div className={`w-full ${className ?? ""}`}>{cards}</div>
  }

  return (
    <div className={`w-full min-h-screen ${className ?? ""}`} style={sk.page}>
      <div className="flex items-center justify-between px-6 py-4 border-b" style={sk.border}>
        <Skeleton className="h-5 w-24 rounded" style={sk.base} />
        <div className="flex gap-2">
          <Skeleton className="h-8 w-28 rounded-lg" style={sk.base} />
          <Skeleton className="h-8 w-20 rounded-lg" style={sk.base} />
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
  if (type === "form") {
    return <FormSkeleton className={className} />
  }
  if (type === "profile") {
    return <ProfileSkeleton className={className} />
  }
  if (type === "departemen-form") {
    return <DepartemenFormSkeleton className={className} />
  }
  return <DataSuratSkeleton className={className} />
}
