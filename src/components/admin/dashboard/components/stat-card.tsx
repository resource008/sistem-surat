import { Card } from "@/components/ui/card"
import { ArrowUpRight } from "lucide-react"

interface StatCardProps {
  title: string
  value: string | number
  description?: string
  icon: React.ElementType
  badge?: React.ReactNode
  accentBg?: string
  accentColor?: string
}

export function StatCard({
  title,
  value,
  icon: Icon,
  badge,
  accentBg = "bg-primary/10",
  accentColor = "text-primary",
}: StatCardProps) {
  return (
    <Card className="transition-all hover:shadow-md duration-200 p-5 flex flex-col gap-4">
      {/* Baris Atas: Ikon Kategori */}
      <div className="flex items-start justify-between">
        <div className={`p-2.5 rounded-2xl ${accentBg} ${accentColor}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>

      {/* Baris Tengah & Bawah: Angka, Badge, dan Judul */}
      <div className="flex flex-col gap-1.5 mt-2">
        <div className="flex items-center gap-3">
          <span className="text-3xl font-bold tracking-tight">{value}</span>
          {badge && <div>{badge}</div>}
        </div>
        <span className="text-[13px] font-medium text-muted-foreground">
          {title}
        </span>
      </div>
    </Card>
  )
}