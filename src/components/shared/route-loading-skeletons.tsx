import { DashboardLoading } from "@/components/admin/dashboard"
import { LoadingSkeleton } from "@/components/shared/loading-skeleton"

type RouteSkeletonType = "dashboard" | "table" | "form" | "profile" | "departemen-form"

export function RouteLoadingSkeleton({ type = "table" }: { type?: RouteSkeletonType }) {
  if (type === "dashboard") {
    return (
      <div className="w-full pb-24 pt-2">
        <DashboardLoading />
      </div>
    )
  }

  return (
    <div className="w-full pb-24 pt-2">
      <LoadingSkeleton type={type} />
    </div>
  )
}
