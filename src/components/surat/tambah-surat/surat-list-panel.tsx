import { CustomFieldsForm } from "../custom-fields"

function EmptyDataField() {
  return (
    <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-3 text-[13px] font-medium text-slate-500 dark:border-neutral-800 dark:bg-neutral-900 dark:text-slate-400">
      Kolom tidak ada. Hubungi administrator untuk mengatur kolom dan mode pengisian.
    </div>
  )
}

export function SuratListPanel({ state, actions }: any) {
  return (
    <section className="flex min-w-0 flex-col gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
      {state.suratList.map((surat: any, idx: number) => (
        <div
          key={surat.id}
          className="w-full shrink-0 transition-all duration-300 animate-in fade-in slide-in-from-bottom-2"
        >
          {state.hasFillableColumns ? (
            <CustomFieldsForm
              columns={state.selectedCustomColumns}
              values={surat.customFields}
              autoFillPreviewValues={{
                sequence: state.previewNomor ?? "",
                currentDate: state.tanggalTerima ?? "",
                department: state.selectedDept?.shortName ?? "",
              }}
              includeBuiltIn
              splitLayout
              strictValueKey
              errors={Object.fromEntries(
                state.selectedCustomColumns.map((column: any) => [
                  column.id,
                  state.formErrors?.[`surat_${idx}_custom_${column.id}`],
                ])
              )}
              onChange={(columnId, value) => actions.updateSuratCustomField(surat.id, columnId, value)}
            />
          ) : (
            <EmptyDataField />
          )}
        </div>
      ))}
    </section>
  )
}
