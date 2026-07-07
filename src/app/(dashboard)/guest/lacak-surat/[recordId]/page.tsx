import { GuestLacakSuratPage } from "@/components/guest/guest-lacak-surat-page"

type PageProps = {
  params: Promise<{ recordId: string }>
}

export default async function Page({ params }: PageProps) {
  const { recordId } = await params
  return <GuestLacakSuratPage initialSheetId={decodeURIComponent(recordId)} />
}
