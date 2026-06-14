export function DashboardLoading() {
  return (
    <div className="flex flex-col gap-5">
      {/* Baris 1 */}
      <div className="grid grid-cols-1 gap-5 2xl:grid-cols-[1fr_1.1fr]">
        <div className="flex flex-col gap-3">
          <div className="h-5 w-24 animate-pulse rounded-md bg-muted" />
          <div className="grid grid-cols-2 gap-2.5">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-32 animate-pulse rounded-xl bg-muted" />
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <div className="h-5 w-36 animate-pulse rounded-md bg-muted" />
          <div className="h-72 animate-pulse rounded-xl bg-muted" />
        </div>
      </div>

      {/* Baris 2 */}
      <div className="flex flex-col gap-3">
        <div className="h-5 w-32 animate-pulse rounded-md bg-muted" />
        <div className="h-80 animate-pulse rounded-xl bg-muted" />
      </div>

      {/* Baris 3 */}
      <div className="flex flex-col gap-3">
        <div className="h-5 w-48 animate-pulse rounded-md bg-muted" />
        <div className="h-52 animate-pulse rounded-xl bg-muted" />
      </div>
    </div>
  )
}
