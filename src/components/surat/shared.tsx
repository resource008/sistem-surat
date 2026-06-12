"use client"

export type {
  DetailPI,
  DetailSurat,
  FormState,
  PIItem,
  RegisterPI,
  RegisterSurat,
  Role,
  SuratItem,
} from "@/types"
export {
  EMPTY_FORM,
  EMPTY_PI_ITEM,
  EMPTY_SURAT_ITEM,
} from "@/types"
export {
  DatePicker,
  FormField,
  inputClass,
  readonlyClass,
} from "@/components/shared/form-controls"

export function formatTanggal(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  })
}
