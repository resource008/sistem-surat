import { headers } from "next/headers"
import { auth } from "@/infrastructure/auth/better-auth"
import DataSuratPage from "@/components/surat/data-surat/data-surat"
import type { Role } from "@/types"

export default async function Page() {
  // Ambil sesi dinamis (Tidak perlu redirect karena sudah diurus middleware)
  const session = await auth.api.getSession({ headers: await headers() })
  const role = (session?.user as any)?.role as Role
  
  return (
    <DataSuratPage
      role={role}
      basePath="/pkl/data-surat"
      printPath="/pkl/cetak"
    />
  )
}