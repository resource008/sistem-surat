import { RoleCetakPage } from "@/components/role-dashboard/cetak-pages"

type CetakPrintSheetPageProps = {
  params: Promise<{ printSheetName: string }>
}

export async function CetakPrintSheetPage({ params }: CetakPrintSheetPageProps) {
  const { printSheetName } = await params
  return <RoleCetakPage printSheetName={decodeURIComponent(printSheetName)} />
}

export function DefaultCetakPage() {
  return <RoleCetakPage printSheetName="" />
}
