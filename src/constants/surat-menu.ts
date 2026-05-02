import { getBasePathByRole } from "@/constants/routes"
import type { Role } from "@/types"
import { FileText, Printer, RefreshCcw } from "lucide-react"

export type MenuItem = {
  label: string
  icon:  React.ComponentType<{ size?: number; strokeWidth?: number }>
  href:  string
  badge: null | number | string
}

export function getMenuItems(role: Role): MenuItem[] {
  const base = getBasePathByRole(role)
  return [
    { label: "Data Surat",  icon: FileText,   href: `${base}/data-surat`, badge: null },
    { label: "Cetak",       icon: Printer,    href: `${base}/cetak/all`,      badge: null },
    { label: "Track Surat", icon: RefreshCcw, href: `${base}/track`,      badge: null },
  ]
}