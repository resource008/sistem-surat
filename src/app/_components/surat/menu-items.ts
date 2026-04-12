import { FileText, Printer, RefreshCcw, Settings } from "lucide-react"
import { routes } from "@/lib/routes"
import type { Role } from "./shared"

export function getMenuItems(role: Role) {
  const base = [
    { label: "Data Surat",      icon: FileText,   href: routes.dataSurat.staff, badge: null },
    { label: "Cetak",           icon: Printer,    href: routes.dataSurat.cetak, badge: null },
    { label: "Track Surat",     icon: RefreshCcw, href: routes.dataSurat.track, badge: "3"  },
    { label: "Pengaturan Akun", icon: Settings,   href: routes.dataSurat.akun,  badge: null },
  ]

  if (role === "ADMIN") {
    // Tambah menu khusus admin nanti di sini
    return base
  }

  // STAFF & PKL — sama
  return base
}