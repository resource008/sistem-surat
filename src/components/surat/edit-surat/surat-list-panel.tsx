import { AlertTriangle, FileText } from "lucide-react"
import { CustomFieldsForm } from "../custom-fields"

export function SuratListPanel({ state, actions }: any) {
  return (
    <>
      {state.formErrors.suratList && (
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800">
          <AlertTriangle size={13} className="text-slate-500 dark:text-slate-400 shrink-0" />
          <p className="text-[13px] text-slate-600 dark:text-slate-400 font-medium">{state.formErrors.suratList}</p>
        </div>
      )}

      {state.suratList.map((surat: any, idx: number) => (
        <div key={surat.id} className="w-full shrink-0">
          {state.selectedCustomColumns.length > 0 ? (
            <CustomFieldsForm
              columns={state.selectedCustomColumns}
              values={surat.customFields}
              autoFillPreviewValues={{
                sequence: state.previewNomor ?? surat.noSurat ?? "",
                currentDate: surat.tanggalSurat ?? state.form?.tanggalTerima ?? "",
                department: state.form?.tujuan ?? state.selectedDept?.shortName ?? "",
              }}
              includeBuiltIn
              splitLayout
              strictValueKey
              errors={Object.fromEntries(
                state.selectedCustomColumns.map((column: any) => [
                  column.id,
                  state.formErrors[`surat_${idx}_custom_${column.id}`],
                ])
              )}
              onChange={(columnId, value) => actions.setSuratCustomField(idx, columnId, value)}
            />
          ) : null}
        </div>
      ))}

      {state.suratList.length === 0 && (
        <div className="rounded-2xl border border-dashed border-slate-200 dark:border-neutral-800 px-6 py-10 text-center">
          <FileText className="mx-auto mb-3 h-8 w-8 text-slate-300 dark:text-slate-700" />
          <p className="text-[13px] text-slate-400 dark:text-slate-500">Belum ada surat. Klik <span className="font-semibold">Tambah</span> untuk menambahkan.</p>
        </div>
      )}
    </>
  )
}
