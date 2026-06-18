import { RegisterSurat } from "@/components/surat/shared"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { FileText } from "lucide-react"
import { Field } from "./field"
import { CustomFieldsView, getCustomSuratColumns } from "../custom-fields"

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
                     bg-white dark:bg-slate-950 overflow-hidden shrink-0">

          <div className="flex items-center gap-2.5 px-5 py-3
                          bg-slate-50 dark:bg-slate-900
                          border-b border-slate-200 dark:border-slate-800">
            <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300">
              Surat {idx + 1}
            </span>
          </div>

          <div className="px-5 py-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {getCustomSuratColumns(register.dept.columns, true).length > 0 ? (
                <CustomFieldsView
                  columns={register.dept.columns}
                  values={detail.customFields}
                  includeBuiltIn
                />
              ) : (
                <>
                  <Field label="Perihal Surat" value={detail.perihal || undefined} fullWidth placeholder="Tidak ada" />
                  <Field label="Nomor Surat"   value={detail.noSurat  || undefined} mono placeholder="Tidak ada" />
                  <Field label="Lampiran"      value={detail.lampiran || undefined} placeholder="Tidak ada" />
                  <Field label="Tanggal Surat"
                    value={format(new Date(detail.tanggalSurat), "dd MMMM yyyy", { locale: id })}
                    fullWidth />
                </>
              )}
            </div>
          </div>

        </div>
      ))}
    </>
  )
}
