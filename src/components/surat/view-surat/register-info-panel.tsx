import { Badge } from "@/components/ui/badge"
import { Field } from "./field"
import { RegisterSurat, formatTanggal } from "@/components/surat/shared"

interface Props {
  register: RegisterSurat
  isPI: boolean
}

export function RegisterInfoPanel({ register, isPI }: Props) {
  return (
    <div className="w-full lg:w-4/12 xl:w-4/12 flex flex-col gap-4 lg:h-full lg:pb-6">
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800
                      bg-white dark:bg-slate-950 overflow-hidden shadow-sm
                      flex flex-col max-h-full">

        {/* Header */}
        <div className="px-6 py-4 bg-linear-to-r from-slate-50 to-white
                        dark:from-slate-900 dark:to-slate-950
                        border-b border-slate-200 dark:border-slate-800 shrink-0">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500
                            uppercase tracking-widest mb-1">
                Nomor Register
              </p>
              <p className="text-[22px] font-mono font-bold text-slate-800
                            dark:text-slate-100 leading-none">
                {register.nomor}
              </p>
            </div>
            <Badge className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full
                              bg-blue-100 dark:bg-blue-900/40
                              text-blue-700 dark:text-blue-300 border-0 mt-0.5">
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
            {!isPI && (
              <Field label="Tujuan" value={(register as any).tujuan || "-"} fullWidth />
            )}
          </div>
        </div>

      </div>
    </div>
  )
}