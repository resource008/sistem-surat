import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { AlertTriangle, FileText, Trash2 } from "lucide-react"
import { DatePicker, FormField } from "../shared"

export function PIListPanel({ state, actions }: any) {
  return (
    <>
      {state.formErrors.piList && (
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
          <AlertTriangle size={13} className="text-red-500 shrink-0" />
          <p className="text-[12px] text-red-600 dark:text-red-400 font-medium">{state.formErrors.piList}</p>
        </div>
      )}

      {state.piList.map((pi: any, idx: number) => (
        <div key={pi.id} className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 overflow-hidden shadow-sm shrink-0">
          <div className="flex items-center justify-between px-5 py-3 bg-slate-50/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center">
                <FileText size={12} className="text-blue-600 dark:text-blue-400" />
              </div>
              <span className="text-[12px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Invoice {idx + 1}</span>
            </div>
            <Button type="button" variant="ghost" size="sm" onClick={() => actions.removePI(idx)} className="h-7 px-2.5 text-[11px] gap-1 rounded-lg text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
              <Trash2 size={11} /> Hapus
            </Button>
          </div>

          <div className="px-5 py-4 flex flex-col gap-4">
            <FormField label="Nama Supplier" error={state.formErrors[`pi_${idx}_namaSupplier`]}>
              <Input
                value={pi.namaSupplier}
                onChange={e => actions.setPiField(idx, "namaSupplier", e.target.value)}
                placeholder="Nama supplier..."
                className={cn("text-[13px] rounded-xl h-10", state.formErrors[`pi_${idx}_namaSupplier`] && "border-red-500 focus-visible:ring-red-500")}
              />
            </FormField>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <FormField label="No. Invoice">
                <Input value={pi.noInvoice} onChange={e => actions.setPiField(idx, "noInvoice", e.target.value)} placeholder="Nomor invoice..." className="text-[13px] rounded-xl h-10 font-mono" />
              </FormField>
              <FormField label="No. Surat">
                <Input value={pi.nomorSurat} onChange={e => actions.setPiField(idx, "nomorSurat", e.target.value)} placeholder="Nomor surat..." className="text-[13px] rounded-xl h-10 font-mono" />
              </FormField>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <FormField label="Tujuan">
                <Input value={pi.tujuan} onChange={e => actions.setPiField(idx, "tujuan", e.target.value)} placeholder="Tujuan..." className="text-[13px] rounded-xl h-10" />
              </FormField>
              <FormField label="CC">
                <Input value={pi.cc} onChange={e => actions.setPiField(idx, "cc", e.target.value)} placeholder="CC..." className="text-[13px] rounded-xl h-10" />
              </FormField>
            </div>

            <FormField label="Tanggal Surat" error={state.formErrors[`pi_${idx}_tanggalSurat`]}>
              <DatePicker
                value={pi.tanggalSurat}
                onChange={val => actions.setPiField(idx, "tanggalSurat", val)}
                hasError={!!state.formErrors[`pi_${idx}_tanggalSurat`]}
              />
            </FormField>
          </div>
        </div>
      ))}

      {state.piList.length === 0 && (
        <div className="rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 px-6 py-10 text-center">
          <FileText className="mx-auto mb-3 h-8 w-8 text-slate-300 dark:text-slate-700" />
          <p className="text-[13px] text-slate-400 dark:text-slate-500">Belum ada PI. Klik <span className="font-semibold">Tambah</span> untuk menambahkan.</p>
        </div>
      )}
    </>
  )
}