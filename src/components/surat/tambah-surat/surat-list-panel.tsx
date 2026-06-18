import { FileText, Plus, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { CustomFieldsForm } from "../custom-fields"

function EmptyDataField() {
  return (
    <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-3 text-[13px] font-medium text-slate-500 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-400">
      Tidak ada kolom yang diisi. Silahkan hubungi admin untuk menambahkan.
    </div>
  )
}

export function SuratListPanel({ state, actions }: any) {
  return (
    <>
      {state.suratList.map((surat: any, index: number) => (
        <div key={surat.id} className="border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-950 overflow-hidden shadow-sm shrink-0">
          <div className="flex items-center justify-between px-5 py-3 bg-slate-50/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center">
                <FileText size={12} className="text-blue-600 dark:text-blue-400" />
              </div>
              <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Surat {index + 1}
              </span>
            </div>
            {state.suratList.length > 1 && (
              <Button type="button" variant="ghost" size="sm" onClick={() => actions.removeSurat(surat.id)}
                className="h-7 px-2.5 text-[11px] gap-1 rounded-lg text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                <Trash2 size={11} /> Hapus
              </Button>
            )}
          </div>
          <div className="px-5 py-4 flex flex-col gap-4">
            {state.hasFillableColumns ? (
              <CustomFieldsForm
                columns={state.selectedCustomColumns}
                values={surat.customFields}
                includeBuiltIn
                onChange={(columnId, value) => actions.updateSuratCustomField(surat.id, columnId, value)}
              />
            ) : (
              <EmptyDataField />
            )}
          </div>
        </div>
      ))}
      {state.hasFillableColumns && (
        <button type="button" onClick={actions.addSurat}
          className="w-full inline-flex items-center justify-center gap-2 text-[13px] font-medium text-blue-600 dark:text-blue-400 border border-dashed border-blue-300 dark:border-blue-700 rounded-2xl py-3 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-400 dark:hover:border-blue-600 transition-all">
          <Plus size={14} /> Tambah Surat Lainnya
        </button>
      )}
    </>
  )
}
