import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { AlertTriangle, FileText, Trash2 } from "lucide-react"
import { useState } from "react"
import { DatePicker, FormField } from "../shared"

const getLampiranNum = (val: string) => val.replace(/[^0-9]/g, "")

export function SuratListPanel({ state, actions }: any) {
  const [focusedLampiran, setFocusedLampiran] = useState<number | null>(null)

  return (
    <>
      {state.formErrors.suratList && (
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
          <AlertTriangle size={13} className="text-red-500 shrink-0" />
          <p className="text-[12px] text-red-600 dark:text-red-400 font-medium">{state.formErrors.suratList}</p>
        </div>
      )}

      {state.suratList.map((surat: any, idx: number) => (
        <div key={surat.id} className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 overflow-hidden shadow-sm shrink-0">
          <div className="flex items-center justify-between px-5 py-3 bg-slate-50/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center">
                <FileText size={12} className="text-blue-600 dark:text-blue-400" />
              </div>
              <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Surat {idx + 1}</span>
            </div>
            <Button type="button" variant="ghost" size="sm" onClick={() => actions.removeSurat(idx)} className="h-7 px-2.5 text-[11px] gap-1 rounded-lg text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
              <Trash2 size={11} /> Hapus
            </Button>
          </div>

          <div className="px-5 py-4 flex flex-col gap-4">
            <FormField label="Perihal Surat" error={state.formErrors[`surat_${idx}_perihal`]}>
              <Input
                value={surat.perihal}
                onChange={e => actions.setSuratField(idx, "perihal", e.target.value)}
                placeholder="Isi perihal / pokok surat..."
                className={cn("text-[13px] rounded-xl h-10", state.formErrors[`surat_${idx}_perihal`] && "border-red-500 focus-visible:ring-red-500")}
              />
            </FormField>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <FormField label="Nomor Surat">
                <Input value={surat.noSurat} onChange={e => actions.setSuratField(idx, "noSurat", e.target.value)} placeholder="Masukkan nomor surat" className="text-[13px] rounded-xl h-10 font-mono" />
              </FormField>

              <FormField label="Lampiran">
                <div className="relative flex h-10 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 transition-all focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 dark:focus-within:border-blue-500">
                  <input
                    type="text" inputMode="numeric" pattern="[0-9]*"
                    value={getLampiranNum(surat.lampiran)}
                    onChange={e => actions.setLampiranNum(idx, e.target.value)}
                    onFocus={() => setFocusedLampiran(idx)}
                    onBlur={() => setFocusedLampiran(null)}
                    placeholder="Masukkan jumlah"
                    style={{ color: focusedLampiran === idx && !getLampiranNum(surat.lampiran) ? 'transparent' : undefined }}
                    className="flex-1 min-w-0 px-3.5 h-full bg-transparent border-0 outline-none text-[13px] text-center font-medium text-slate-700 dark:text-slate-300 placeholder:text-slate-400 dark:placeholder:text-slate-500 placeholder:text-center placeholder:font-normal"
                  />
                  <div className="flex items-center justify-center px-3.5 shrink-0 border-l border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-[11px] font-bold tracking-widest text-slate-400 dark:text-slate-500 select-none">SET</div>
                </div>
              </FormField>
            </div>

            <FormField label="Tanggal Surat" error={state.formErrors[`surat_${idx}_tanggalSurat`]}>
              <DatePicker
                value={surat.tanggalSurat}
                onChange={val => actions.setSuratField(idx, "tanggalSurat", val)}
                hasError={!!state.formErrors[`surat_${idx}_tanggalSurat`]}
              />
            </FormField>
          </div>
        </div>
      ))}

      {state.suratList.length === 0 && (
        <div className="rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 px-6 py-10 text-center">
          <FileText className="mx-auto mb-3 h-8 w-8 text-slate-300 dark:text-slate-700" />
          <p className="text-[13px] text-slate-400 dark:text-slate-500">Belum ada surat. Klik <span className="font-semibold">Tambah</span> untuk menambahkan.</p>
        </div>
      )}
    </>
  )
}