import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import type { RiwayatAktivitasPengguna } from "@/domain/admin-dashboard/types"
import { formatNullableDate, getInitial } from "@/lib/admin-dashboard"

interface UserActivityTableProps {
  users: RiwayatAktivitasPengguna[]
}

const ROW_COLORS = [
  "bg-amber-50/80   dark:bg-amber-950/20",
  "bg-fuchsia-50/80 dark:bg-fuchsia-950/20",
  "bg-emerald-50/80 dark:bg-emerald-950/20",
]

const AVATAR_PALETTE = [
  "#f59e0b", // amber
  "#ef4444", // red
  "#8b5cf6", // violet
  "#3b82f6", // blue
  "#10b981", // emerald
  "#f97316", // orange
  "#06b6d4", // cyan
  "#ec4899", // pink
  "#14b8a6", // teal
  "#6366f1", // indigo
]

function getAvatarColor(name: string): string {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return AVATAR_PALETTE[Math.abs(hash) % AVATAR_PALETTE.length]
}

export function UserActivityTable({ users }: UserActivityTableProps) {
  return (
    <section className="space-y-3">
      <h2 className="text-base font-semibold tracking-normal">
        Riwayat Aktivitas Pengguna
      </h2>
      <Card className="overflow-hidden rounded-xl">
        <CardContent className="p-4 sm:p-5">
          {/* Header */}
          <div className="grid grid-cols-[1fr_auto] px-2 pb-2.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground sm:grid-cols-[1.8fr_1.4fr_0.8fr] sm:px-3">
            <div>Nama</div>
            <div className="hidden sm:block">Terakhir aktif</div>
            <div>Status</div>
          </div>

          {/* Rows */}
          <div className="max-h-[300px] space-y-1.5 overflow-y-auto pr-0.5">
            {users.map((user, index) => (
              <div
                key={user.id}
                className={`grid grid-cols-[1fr_auto] items-center rounded-lg px-2 py-2 text-sm transition-colors sm:grid-cols-[1.8fr_1.4fr_0.8fr] sm:px-3 sm:py-2.5 ${
                  ROW_COLORS[index % ROW_COLORS.length]
                }`}
              >
                {/* Nama */}
                <div className="flex min-w-0 items-center gap-2 font-medium text-foreground">
                  <div className="size-7 shrink-0 rounded-full bg-cyan-500 flex items-center justify-center text-[10px] font-semibold text-white">
                    {getInitial(user.nama)}
                  </div>
                  <span className="truncate">{user.nama}</span>
                </div>

                {/* Terakhir aktif — disembunyikan di mobile */}
                <div className="hidden text-xs text-foreground/70 sm:block">
                  {formatNullableDate(user.terakhirMasuk)}
                </div>

                {/* Status */}
                <div>
                  <Badge
                    variant={user.status === "Sedang aktif" ? "default" : "secondary"}
                    className="text-[11px]"
                  >
                    {user.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </section>
  )
}