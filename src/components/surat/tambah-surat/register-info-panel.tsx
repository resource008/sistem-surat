import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { id as localeID } from "date-fns/locale"
import { CalendarIcon, Hash } from "lucide-react"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FormField, inputClass, readonlyClass } from "../shared"; // perhatikan "../"

const parseLocalDate = (str: string) => {
  if (!str) return new Date()
  const [y, m, d] = str.split("-").map(Number)
  return new Date(y, m - 1, d)
}

export function RegisterInfoPanel({ state, actions }: any) {
  return (
    <div className="w-full lg:w-4/12 xl:w-4/12 flex flex-col gap-4 lg:h-full lg:pb-6">
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 overflow-hidden shadow-sm flex flex-col max-h-full">
        <div className="px-5 py-4 bg-gradient-to-r from-slate-50 to-white dark:from-slate-900 dark:to-slate-950 border-b border-slate-200 dark:border-slate-800 shrink-0">
          <h3 className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Informasi Register
          </h3>
        </div>

        <div className="px-5 py-5 flex flex-col gap-5 lg:overflow-y-auto [&::-webkit-scrollbar]:hidden">
          <FormField label="Departemen">
            <Select value={state.deptId} onValueChange={actions.setDeptId}>
              <SelectTrigger className={cn(inputClass, "h-10 shadow-none")}>
                <SelectValue placeholder="Pilih departemen" />
              </SelectTrigger>
              <SelectContent className="dark:bg-slate-950 border-slate-200 dark:border-slate-800">
                {state.deptList.map((d: any) => (
                  <SelectItem key={d.id} value={d.id} className="text-[13px] cursor-pointer">
                    {d.shortName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>

          <FormField label="Tanggal Terima">
            <div className={cn(readonlyClass, "flex items-center gap-2")}>
              <CalendarIcon className="h-3.5 w-3.5 text-slate-400 shrink-0" />
              <span className="text-[13px] text-slate-700 dark:text-slate-300">
                {format(parseLocalDate(state.tanggalTerima), "dd MMM yyyy", { locale: localeID })}
              </span>
            </div>
          </FormField>

          <FormField label="Asal Surat">
            <input className={inputClass} value={state.asalSurat}
              onChange={e => actions.setAsalSurat(e.target.value)}
              placeholder="Masukkan asal surat" />
          </FormField>

          <FormField label="Nomor Registrasi">
            <div className={cn(readonlyClass, "flex items-center gap-2")}>
              <Hash className="h-3.5 w-3.5 text-slate-400 shrink-0" />
              <span className={cn(
                "font-mono text-[13px]",
                state.loadingNomor || !state.previewNomor
                  ? "text-slate-400 dark:text-slate-500 italic font-sans text-[12px]"
                  : "text-slate-700 dark:text-slate-300 font-medium"
              )}>
                {state.loadingNomor ? <span className="animate-pulse">Memuat…</span> : state.previewNomor ?? "Pilih departemen dulu"}
              </span>
              {state.selectedDept && (
                <span className="ml-auto shrink-0 text-[11px] font-medium text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-full px-2 py-0.5">
                  {state.selectedDept.shortName}
                </span>
              )}
            </div>
          </FormField>
        </div>
      </div>
    </div>
  )
}