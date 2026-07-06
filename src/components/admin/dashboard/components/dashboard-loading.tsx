import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"

function SectionTitleSkeleton({ className = "w-24" }: { className?: string }) {
  return <Skeleton className={`h-5 ${className}`} />
}

function ActivityCardSkeleton({ withBadge = false }: { withBadge?: boolean }) {
  return (
    <Card className="border-0 bg-muted/30 shadow-sm ring-0">
      <CardContent className="flex h-full min-h-[160px] flex-col p-4 sm:p-5">
        <div className="flex w-full items-start justify-between gap-3">
          <Skeleton className="size-9 rounded-xl sm:size-10" />
          {withBadge ? <Skeleton className="h-6 w-16 rounded-full" /> : null}
        </div>
        <div className="mt-auto flex w-full flex-col gap-2">
          <Skeleton className="h-8 w-20 sm:h-9" />
          <Skeleton className="h-4 w-32" />
        </div>
      </CardContent>
    </Card>
  )
}

function ActivitySummarySkeleton() {
  return (
    <div className="grid h-full grid-cols-1 gap-2.5 sm:grid-cols-2 sm:gap-3 xl:grid-cols-3">
      <ActivityCardSkeleton />
      <ActivityCardSkeleton />
      <ActivityCardSkeleton withBadge />
    </div>
  )
}

function DepartemenTableSkeleton() {
  return (
    <Card className="overflow-hidden rounded-xl">
      <CardContent className="p-4 sm:p-5">
        <div className="grid grid-cols-[1fr_64px_72px] px-2 pb-2.5 sm:grid-cols-[1fr_80px_80px] sm:px-3">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-3 w-10" />
          <Skeleton className="h-3 w-12" />
        </div>
        <div className="space-y-1.5 pr-0.5">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="grid grid-cols-[1fr_64px_72px] items-center rounded-lg bg-muted/30 px-2 py-2 sm:grid-cols-[1fr_80px_80px] sm:px-3 sm:py-2.5"
            >
              <Skeleton className="h-4 w-32 max-w-full" />
              <Skeleton className="h-4 w-9" />
              <Skeleton className="h-4 w-10" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function ChartCardSkeleton() {
  return (
    <Card className="overflow-hidden rounded-xl">
      <CardContent className="p-4 sm:p-5">
        <div className="relative h-64 w-full sm:h-80">
          <div className="absolute inset-x-0 top-4 space-y-10">
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton key={index} className="h-px w-full" />
            ))}
          </div>
          <div className="absolute inset-x-3 bottom-10 flex items-end justify-between gap-2">
            {[42, 76, 54, 88, 64, 72, 48].map((height, index) => (
              <Skeleton
                key={index}
                className="w-full rounded-t-lg"
                style={{ height: `${height}%` }}
              />
            ))}
          </div>
          <div className="absolute inset-x-0 bottom-0 flex justify-between gap-2">
            {Array.from({ length: 7 }).map((_, index) => (
              <Skeleton key={index} className="h-3 w-10" />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function StatistikSuratSkeleton() {
  return (
    <section className="space-y-3">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <SectionTitleSkeleton className="w-32" />
        <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2 lg:w-auto">
          <Skeleton className="h-9 w-full rounded-lg sm:min-w-44 lg:w-44" />
          <Skeleton className="h-9 w-full rounded-lg sm:min-w-44 lg:w-44" />
        </div>
      </div>
      <ChartCardSkeleton />
    </section>
  )
}

function UserActivityTableSkeleton() {
  return (
    <section className="space-y-3">
      <SectionTitleSkeleton className="w-48" />
      <Card className="overflow-hidden rounded-xl">
        <CardContent className="p-4 sm:p-5">
          <div className="grid grid-cols-[1fr_auto] px-2 pb-2.5 sm:grid-cols-[1.8fr_1.4fr_0.8fr] sm:px-3">
            <Skeleton className="h-3 w-12" />
            <Skeleton className="hidden h-3 w-24 sm:block" />
            <Skeleton className="h-3 w-12" />
          </div>
          <div className="space-y-1.5 pr-0.5">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="grid grid-cols-[1fr_auto] items-center rounded-lg bg-muted/30 px-2 py-2 sm:grid-cols-[1.8fr_1.4fr_0.8fr] sm:px-3 sm:py-2.5"
              >
                <div className="flex min-w-0 items-center gap-2">
                  <Skeleton className="size-8 rounded-full" />
                  <Skeleton className="h-4 w-32 max-w-full" />
                </div>
                <Skeleton className="hidden h-4 w-36 sm:block" />
                <Skeleton className="h-6 w-16 rounded-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </section>
  )
}

export function DashboardLoading() {
  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-1 gap-5 2xl:grid-cols-[1fr_1.1fr] 2xl:items-stretch">
        <div className="flex flex-col gap-3">
          <SectionTitleSkeleton />
          <div className="flex-1">
            <ActivitySummarySkeleton />
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <SectionTitleSkeleton className="w-36" />
          <DepartemenTableSkeleton />
        </div>
      </div>

      <StatistikSuratSkeleton />
      <UserActivityTableSkeleton />
    </div>
  )
}
