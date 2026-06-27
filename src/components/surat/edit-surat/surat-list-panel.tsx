import { Button } from "@/components/ui/button"
import { AlertTriangle, FileText, Trash2 } from "lucide-react"
import { CustomFieldsForm } from "../custom-fields"

function EmptyDataField() {
  return (
    <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-3 text-[13px] font-medium text-slate-500 dark:border-neutral-800 dark:bg-neutral-900 dark:text-slate-400">
      Tidak ada kolom yang diisi. Silahkan hubungi admin untuk menambahkan.
    </div>
  )
}

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
        <div key={surat.id} className="rounded-2xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 overflow-hidden shrink-0">
          <div className="flex items-center justify-between px-5 py-3 bg-slate-50 dark:bg-neutral-900 border-b border-slate-200 dark:border-neutral-800">
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-neutral-800 flex items-center justify-center">
                <FileText size={12} className="text-slate-500 dark:text-slate-400" />
              </div>
              <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300">Surat {idx + 1}</span>
            </div>
            <Button
              type="button"
              variant="action-danger-soft"
              size="action-sm"
              onClick={() => actions.removeSurat(idx)}
            >
              <Trash2 size={11} /> Hapus
            </Button>
          </div>

          <div className="px-5 py-4 flex flex-col gap-4">
            {state.selectedCustomColumns.length > 0 ? (
              <CustomFieldsForm
                columns={state.selectedCustomColumns}
                values={surat.customFields}
                includeBuiltIn
                errors={Object.fromEntries(
                  state.selectedCustomColumns.map((column: any) => [
                    column.id,
                    state.formErrors[`surat_${idx}_custom_${column.id}`],
                  ])
                )}
                onChange={(columnId, value) => actions.setSuratCustomField(idx, columnId, value)}
              />
            ) : (
              <EmptyDataField />
            )}
          </div>
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
