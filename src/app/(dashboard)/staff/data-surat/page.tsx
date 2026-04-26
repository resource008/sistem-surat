import { headers }   from "next/headers"
import { auth }      from "@/infrastructure/auth/better-auth"
import { redirect }  from "next/navigation"
import DataSuratPage from "@/components/surat/data-surat"
import type { Role } from "@/types"

export default async function Page() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect("/login")
  const role = (session.user as any).role as Role
  return (
    <DataSuratPage
      role={role}
      basePath="/staff/data-surat"
      printPath="/staff/cetak"
    />
  )
}