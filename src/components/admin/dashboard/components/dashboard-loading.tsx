import { Skeleton } from "@/components/ui/skeleton"

export function DashboardLoading() {
  return (
    <div className="flex flex-col gap-5">
      {/* Baris 1 */}
      <div className="grid grid-cols-1 gap-5 2xl:grid-cols-[1fr_1.1fr]">
        <div className="flex flex-col gap-3">
          <Skeleton className="h-5 w-24" />
          <div className="grid grid-cols-2 gap-2.5">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-xl" />
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <Skeleton className="h-5 w-36" />
          <Skeleton className="h-72 rounded-xl" />
        </div>
      </div>

      {/* Baris 2 */}
      <div className="flex flex-col gap-3">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-80 rounded-xl" />
      </div>

      {/* Baris 3 */}
      <div className="flex flex-col gap-3">
        <Skeleton className="h-5 w-48" />
        <Skeleton className="h-52 rounded-xl" />
      </div>
    </div>
  )
}
