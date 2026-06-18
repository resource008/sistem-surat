import { Badge } from "@/components/ui/badge"
import { Field } from "./field"
import { RegisterSurat, formatTanggal } from "@/components/surat/shared"
import { getSuratTujuan } from "@/lib/surat-helpers"

interface Props {
  register: RegisterSurat
}

export function RegisterInfoPanel({ register }: Props) {
  return (
    <div className="w-full lg:w-4/12 xl:w-4/12 flex flex-col gap-4 lg:h-full lg:pb-6">
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800
                      bg-white dark:bg-slate-950 overflow-hidden
                      flex flex-col max-h-full">

        {/* Header */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-900
                        border-b border-slate-200 dark:border-slate-800 shrink-0">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[12px] font-medium text-slate-400 dark:text-slate-500 mb-1">
                Nomor Register
              </p>
              <p className="text-[22px] font-mono font-bold text-slate-800
                            dark:text-slate-100 leading-none">
                {register.nomor}
              </p>
            </div>
            <Badge className="text-[12px] font-medium px-2.5 py-0.5 rounded-full
                              bg-slate-100 dark:bg-slate-800
                              text-slate-700 dark:text-slate-300
                              border border-slate-200 dark:border-slate-700 mt-0.5">
              {register.dept.shortName}
            </Badge>
          </div>
        </div>

        {/* Detail */}
        <div className="px-6 py-5 lg:overflow-y-auto
                        [&::-webkit-scrollbar]:hidden
                        [-ms-overflow-style:none]
                        [scrollbar-width:none]">
          <div className="flex flex-col gap-4">
            <Field label="Asal Surat" value={register.asalSurat} fullWidth />
            <Field label="Tanggal Terima" value={formatTanggal(register.tanggalTerima)} fullWidth />
            <Field label="Tujuan" value={getSuratTujuan(register)} fullWidth />
          </div>
        </div>

      </div>
    </div>
  )
}
