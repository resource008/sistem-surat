import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import type { RiwayatAktivitasPengguna } from "@/domain/admin-dashboard/types"
import { formatNullableDate } from "@/lib/admin-dashboard"
import { getAvatarColor, getInitials } from "@/lib/avatar"

interface UserActivityTableProps {
  users: RiwayatAktivitasPengguna[]
}

const ROW_COLORS = [
  "bg-amber-50/80   dark:bg-amber-950/20",
  "bg-fuchsia-50/80 dark:bg-fuchsia-950/20",
  "bg-emerald-50/80 dark:bg-emerald-950/20",
]

export function UserActivityTable({ users }: UserActivityTableProps) {
  return (
    <section className="space-y-3">
      <h2 className="text-base font-semibold tracking-normal">
        Riwayat Aktivitas Pengguna
      </h2>
      <Card className="overflow-hidden rounded-xl">
        <CardContent className="p-4 sm:p-5">
          {/* Header */}
          <div className="grid grid-cols-[1fr_auto] px-2 pb-2.5 text-xs font-semibold tracking-wide text-muted-foreground sm:grid-cols-[1.8fr_1.4fr_0.8fr] sm:px-3">
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
                  <div
                    style={{ backgroundColor: getAvatarColor(user.nama) }}
                    className="size-8 shrink-0 rounded-full flex items-center justify-center text-xs font-semibold text-white"
                  >
                    {getInitials(user.nama)}
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
