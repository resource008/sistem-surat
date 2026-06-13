import { RegisterSurat } from "@/components/surat/shared"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { FileText } from "lucide-react"
import { Field } from "./field"

interface Props {
  register: RegisterSurat
}

export function SuratListPanel({ register }: Props) {
  if (!register.detailSurat?.length) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 dark:border-slate-800
                      px-6 py-12 text-center lg:h-full
                      flex flex-col items-center justify-center min-h-50">
        <FileText className="mb-3 h-8 w-8 text-slate-300 dark:text-slate-700" />
        <p className="text-[13px] text-slate-400 dark:text-slate-500">
          Belum ada surat dalam register ini.
        </p>
      </div>
    )
  }

  return (
    <>
      {register.detailSurat.map((detail, idx) => (
        <div key={detail.id}
          className="rounded-2xl border border-slate-200 dark:border-slate-800
                     bg-white dark:bg-slate-950 overflow-hidden shadow-sm shrink-0">

          <div className="flex items-center gap-2.5 px-5 py-3
                          bg-slate-50/80 dark:bg-slate-900/80
                          border-b border-slate-200 dark:border-slate-800">
            <span className="text-[12px] font-bold text-slate-700 dark:text-slate-300
                             uppercase tracking-wider">
              Surat {idx + 1}
            </span>
          </div>

          <div className="px-5 py-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Perihal Surat" value={detail.perihal || undefined} fullWidth placeholder="Tidak ada" />
              <Field label="Nomor Surat"   value={detail.noSurat  || undefined} mono placeholder="Tidak ada" />
              <Field label="Lampiran"      value={detail.lampiran || undefined} placeholder="Tidak ada" />
              <Field label="Tanggal Surat"
                value={format(new Date(detail.tanggalSurat), "dd MMMM yyyy", { locale: id })}
                fullWidth />
            </div>
          </div>

        </div>
      ))}
    </>
  )
}