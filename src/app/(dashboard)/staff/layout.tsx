import { StaffLayout } from "@/components/staff/staff-layout"

export default function Layout({ children }: { children: React.ReactNode }) {
  // Hapus role="STAFF", cukup kirimkan children
  return <StaffLayout>{children}</StaffLayout>
}