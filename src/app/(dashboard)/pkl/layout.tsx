import { PklLayout } from "@/components/pkl/pkl-layout"

export default function Layout({ children }: { children: React.ReactNode }) {
  // Hapus role="PKL", cukup kirimkan children
  return <PklLayout>{children}</PklLayout>
}