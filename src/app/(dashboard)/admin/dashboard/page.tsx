import { Users, Building2, Mail, FileText } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const stats = [
  {
    label: "Total Surat Masuk",
    value: "—",
    icon: Mail,
    desc: "Semua register surat",
  },
  {
    label: "Register PI",
    value: "—",
    icon: FileText,
    desc: "Semua register PI",
  },
  {
    label: "Departemen Aktif",
    value: "—",
    icon: Building2,
    desc: "Departemen terdaftar",
  },
  {
    label: "Total User",
    value: "—",
    icon: Users,
    desc: "Admin, Staff, PKL",
  },
]

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Selamat datang, Admin</h2>
        <p className="text-sm text-muted-foreground">
          Ringkasan data sistem surat.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-semibold">{stat.value}</p>
                <p className="mt-1 text-xs text-muted-foreground">{stat.desc}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}