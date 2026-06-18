import type { SuratItem } from "@/types"
import { createRandomId } from "@/lib/random-id"

export const emptySuratItem = (tujuanDef?: string): SuratItem => ({
  id: createRandomId(),
  perihal: "",
  noSurat: "",
  lampiran: "",
  tujuan: tujuanDef ?? "",
  tanggalSurat: "",
  customFields: {},
})

export const applyTujuanToSuratList = (list: SuratItem[], tujuan: string): SuratItem[] =>
  list.map((item) => ({ ...item, tujuan }))
