import { Skeleton } from "@/components/ui/skeleton"

export function TrackTableListSkeleton() {
  return (
    <div className="flex flex-col gap-4 pb-24">
      <div className="hidden overflow-hidden rounded-xl border border-border/40 bg-background md:block">
        <div className="grid grid-cols-[minmax(0,1fr)_140px_140px_120px] border-b border-border/40 bg-muted/40 px-4 py-3">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-12" />
          <Skeleton className="h-3 w-12" />
          <Skeleton className="h-3 w-10" />
        </div>
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="grid grid-cols-[minmax(0,1fr)_140px_140px_120px] items-center border-b border-border/40 px-4 py-3 last:border-b-0"
          >
            <Skeleton className="h-4 w-52 max-w-full" />
            <Skeleton className="h-5 w-24 rounded-full" />
            <Skeleton className="h-5 w-16 rounded-full" />
            <div className="flex items-center gap-1">
              <Skeleton className="size-7 rounded-lg" />
              <Skeleton className="size-7 rounded-lg" />
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-3 md:hidden">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="rounded-xl border border-border/40 bg-background p-4">
            <div className="flex items-start justify-between gap-3">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
            <div className="mt-4 flex items-center justify-between gap-3">
              <Skeleton className="h-3 w-12" />
              <Skeleton className="h-5 w-24 rounded-full" />
            </div>
            <div className="mt-4 flex items-center justify-between gap-3">
              <Skeleton className="h-3 w-10" />
              <div className="flex items-center gap-1">
                <Skeleton className="size-7 rounded-lg" />
                <Skeleton className="size-7 rounded-lg" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function TrackTableDetailSkeleton() {
  return (
    <div className="flex flex-col gap-4 pb-32">
      <div className="rounded-xl border border-border/40 bg-background">
        <div className="border-b border-border/40 px-4 py-4">
          <div className="flex items-center gap-3">
            <Skeleton className="size-9 rounded-lg" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <div className="grid gap-3 px-4 py-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="grid gap-1 sm:grid-cols-[140px_minmax(0,1fr)]">
              <Skeleton className="h-4 w-24" />
              <Skeleton className={index >= 2 ? "h-5 w-16 rounded-full" : "h-4 w-56 max-w-full"} />
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-border/40 bg-background">
        <div className="border-b border-border/40 px-4 py-4">
          <Skeleton className="h-4 w-28" />
        </div>
        <div className="hidden overflow-hidden md:block">
          <div className="grid grid-cols-[80px_220px_minmax(0,1fr)_140px_160px] items-center bg-muted/40 px-4 py-3">
            <Skeleton className="h-3 w-6" />
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-3 w-20" />
          </div>
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="grid grid-cols-[80px_220px_minmax(0,1fr)_140px_160px] items-center border-t border-border/40 px-4 py-3"
            >
              <Skeleton className="h-4 w-5" />
              <div className="flex items-center gap-2">
                <Skeleton className="size-3 rounded-full" />
                <Skeleton className="h-4 w-16" />
              </div>
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-16" />
              <div className="flex flex-col items-start gap-1">
                <Skeleton className="h-5 w-14 rounded-full" />
                {index % 2 === 0 ? <Skeleton className="h-5 w-16 rounded-full" /> : null}
              </div>
            </div>
          ))}
        </div>

        <div className="grid gap-2 p-4 md:hidden">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="rounded-lg border border-border/40 p-3">
              <div className="flex items-center justify-between gap-3">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-5 w-8 rounded-full" />
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <Skeleton className="h-5 w-16 rounded-full" />
                <Skeleton className="h-5 w-14 rounded-full" />
                <Skeleton className="h-5 w-20 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function TrackFormPanelSkeleton({
  fields = 1,
  withAction = false,
}: {
  fields?: number
  withAction?: boolean
}) {
  return (
    <div className="rounded-xl border border-border/40 bg-background">
      <div className="flex items-center justify-between gap-3 border-b border-border/40 px-4 py-4">
        <div className="flex items-start gap-3">
          <Skeleton className="size-9 rounded-lg" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-64 max-w-full" />
          </div>
        </div>
        {withAction ? <Skeleton className="h-8 w-24 rounded-lg" /> : null}
      </div>
      <div className="grid gap-3 p-4">
        {Array.from({ length: fields }).map((_, index) => (
          <div key={index} className="grid gap-2">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-8 w-full rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  )
}

export function TrackTableFormSkeleton() {
  return (
    <div className="flex flex-col gap-4 pb-28">
      <TrackFormPanelSkeleton fields={1} />
      <TrackFormPanelSkeleton fields={2} withAction />
      <div className="rounded-xl border border-border/40 bg-background">
        <div className="border-b border-border/40 px-4 py-4">
          <div className="flex items-start gap-3">
            <Skeleton className="size-9 rounded-lg" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-3 w-72 max-w-full" />
            </div>
          </div>
        </div>
        <div className="p-4">
          <div className="rounded-xl border border-border/40 bg-muted/10">
            <div className="flex flex-col gap-3 border-b border-border/40 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <Skeleton className="size-3 rounded-full" />
                <div className="space-y-1">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-3 w-14" />
                </div>
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-7 w-20 rounded-lg" />
                <Skeleton className="h-7 w-20 rounded-lg" />
                <Skeleton className="h-8 w-24 rounded-lg" />
              </div>
            </div>
            <div className="grid gap-3 p-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="rounded-lg border border-border/40 bg-background">
                  <div className="flex items-center justify-between gap-3 px-3 py-3">
                    <div className="flex min-w-0 flex-1 items-center gap-3">
                      <Skeleton className="size-4" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-14" />
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Skeleton className="size-7 rounded-lg" />
                      <Skeleton className="size-7 rounded-lg" />
                      <Skeleton className="size-7 rounded-lg" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
