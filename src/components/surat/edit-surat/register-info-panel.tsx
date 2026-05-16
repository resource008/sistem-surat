import { CalendarIcon, Hash } from "lucide-react"
import { cn } from "@/lib/utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { FormField, inputClass, readonlyClass } from "../shared"

const DEPT_OPTIONS = ["HRD","IT","ENG","BPA","SND","SMD","IAD","MD","GIS","FAD","TAX","PS","ERP","CID","MED", "OMD"]

export function RegisterInfoPanel({ state, actions }: any) {
  return (
    <div className="w-full lg:w-4/12 xl:w-4/12 flex flex-col gap-4 lg:h-full lg:pb-6">
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 overflow-hidden shadow-sm flex flex-col max-h-full">
        <div className="px-6 py-4 bg-gradient-to-r from-slate-50 to-white dark:from-slate-900 dark:to-slate-950 border-b border-slate-200 dark:border-slate-800 shrink-0">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">
                Nomor Register
              </p>
              <span className="text-[22px] font-mono font-bold text-slate-800 dark:text-slate-100 leading-none">
                {state.original.nomor}
              </span>
            </div>
            <Badge className="shrink-0 mt-0.5 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border-0">
              {state.form.deptId || state.original.dept?.shortName}
            </Badge>
          </div>
        </div>

        <div className="px-6 py-5 flex flex-col gap-4 lg:overflow-y-auto [&::-webkit-scrollbar]:hidden">
          {!state.isPI && (
            <FormField label="Departemen" error={state.formErrors.deptId}>
              <Select value={state.form.deptId} onValueChange={val => actions.setField("deptId", val)}>
                <SelectTrigger className={cn("text-[13px] rounded-xl h-10", state.formErrors.deptId && "border-red-500")}>
                  <SelectValue placeholder="Pilih departemen..." />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  {DEPT_OPTIONS.map(d => (
                    <SelectItem key={d} value={d} className="text-[13px] cursor-pointer">
                      {d}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>
          )}

          <div className="flex flex-col gap-4">
            <FormField label="Asal Surat" error={state.formErrors.asalSurat}>
              <Input
                value={state.form.asalSurat}
                onChange={e => actions.setField("asalSurat", e.target.value)}
                placeholder="Contoh: PT. Maju Mundur"
                className={cn("text-[13px] rounded-xl h-10", state.formErrors.asalSurat && "border-red-500 focus-visible:ring-red-500")}
              />
            </FormField>
            {!state.isPI && (
              <FormField label="Tujuan">
                <div className={cn("w-full px-3.5 h-10 flex items-center rounded-xl border text-[13px] font-medium border-slate-100 dark:border-slate-800/50 bg-slate-50 dark:bg-slate-900/40 cursor-not-allowed select-none", state.form.tujuan ? "text-slate-600 dark:text-slate-400" : "text-slate-400 dark:text-slate-500")}>
                  {state.form.tujuan || "Otomatis dari departemen"}
                </div>
              </FormField>
            )}
          </div>

          <FormField label="Tanggal Terima">
            <div className={cn(readonlyClass, "w-full px-3.5 h-10 flex items-center rounded-xl border text-[13px] font-medium border-slate-100 dark:border-slate-800/50 bg-slate-50 dark:bg-slate-900/40 text-slate-400 dark:text-slate-500 cursor-not-allowed select-none")}>
              {new Date(state.original.tanggalTerima).toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" })}
            </div>
          </FormField>
        </div>
      </div>
    </div>
  )
}