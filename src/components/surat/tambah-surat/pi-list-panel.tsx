import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { id as localeID } from "date-fns/locale"
import { CalendarIcon, FileText, Plus, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { FormField, inputClass, readonlyClass } from "../shared"

const parseLocalDate = (str: string) => {
  if (!str) return new Date()
  const [y, m, d] = str.split("-").map(Number)
  return new Date(y, m - 1, d)
}

export function PIListPanel({ state, actions }: any) {
  return (
    <>
      {state.piList.map((pi: any, index: number) => (
        <div key={pi.id} className="border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-950 overflow-hidden shadow-sm shrink-0">
          <div className="flex items-center justify-between px-5 py-3 bg-slate-50/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center">
                <FileText size={12} className="text-blue-600 dark:text-blue-400" />
              </div>
              <span className="text-[12px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Invoice {index + 1}
              </span>
            </div>
            {state.piList.length > 1 && (
              <Button type="button" variant="ghost" size="sm" onClick={() => actions.removePI(pi.id)}
                className="h-7 px-2.5 text-[11px] gap-1 rounded-lg text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                <Trash2 size={11} /> Hapus
              </Button>
            )}
          </div>
          <div className="px-5 py-4 flex flex-col gap-4">
            <FormField label="Nama Supplier">
              <input className={inputClass} value={pi.namaSupplier}
                onChange={e => actions.updatePI(pi.id, "namaSupplier", e.target.value)}
                placeholder="Masukkan nama supplier" />
            </FormField>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="No. Invoice">
                <input className={inputClass} value={pi.noInvoice ?? ""}
                  onChange={e => actions.updatePI(pi.id, "noInvoice", e.target.value)}
                  placeholder="Masukkan no. invoice" />
              </FormField>
              <FormField label="No. Surat">
                <input className={inputClass} value={pi.nomorSurat ?? ""}
                  onChange={e => actions.updatePI(pi.id, "nomorSurat", e.target.value)}
                  placeholder="Opsional" />
              </FormField>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="Tujuan">
                <div className={cn(readonlyClass, "flex items-center gap-2")}>
                  <span className="text-[13px] text-slate-700 dark:text-slate-300">{pi.tujuan || "-"}</span>
                </div>
              </FormField>
              <FormField label="CC">
                <input className={inputClass} value={pi.cc ?? ""}
                  onChange={e => actions.updatePI(pi.id, "cc", e.target.value)}
                  placeholder="Opsional" />
              </FormField>
            </div>

            <FormField label="Tanggal Surat">
              <Popover>
                <PopoverTrigger asChild>
                  <Button type="button" variant="outline"
                    className={cn(inputClass, "h-10 justify-start text-left shadow-none font-normal", !pi.tanggalSurat && "text-slate-400 dark:text-slate-500")}>
                    <CalendarIcon className="mr-2 h-3.5 w-3.5 text-slate-400" />
                    {pi.tanggalSurat ? format(parseLocalDate(pi.tanggalSurat), "dd MMM yyyy", { locale: localeID }) : "Pilih tanggal"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 border-slate-200 dark:border-slate-800" align="start">
                  <Calendar mode="single"
                    selected={pi.tanggalSurat ? parseLocalDate(pi.tanggalSurat) : undefined}
                    onSelect={d => actions.updatePI(pi.id, "tanggalSurat", d ? format(d, "yyyy-MM-dd") : "")} />
                </PopoverContent>
              </Popover>
            </FormField>
          </div>
        </div>
      ))}
      <button type="button" onClick={actions.addPI}
        className="w-full inline-flex items-center justify-center gap-2 text-[13px] font-medium text-blue-600 dark:text-blue-400 border border-dashed border-blue-300 dark:border-blue-700 rounded-2xl py-3 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-400 dark:hover:border-blue-600 transition-all">
        <Plus size={14} /> Tambah Invoice Lainnya
      </button>
    </>
  )
}