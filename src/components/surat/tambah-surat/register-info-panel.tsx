import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { id as localeID } from "date-fns/locale"

import { FormField, inputClass, readonlyClass } from "../shared"

const parseLocalDate = (str: string) => {
  if (!str) return new Date()
  const [y, m, d] = str.split("-").map(Number)
  return new Date(y, m - 1, d)
}

export function RegisterInfoPanel({ state, actions }: any) {
  const nomorRegister = state.loadingNomor
    ? "Memuat..."
    : state.previewNomor ?? "N/A"
  const deptBadge = state.selectedDept?.shortName ?? "N/A"

  return (
    <div className="w-full lg:w-4/12 xl:w-4/12 flex flex-col gap-4 lg:h-full lg:pb-6">
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 overflow-hidden flex flex-col max-h-full">
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shrink-0">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[12px] font-medium text-slate-400 dark:text-slate-500 mb-1">
                Nomor Register
              </p>
              <p className={cn(
                "font-mono leading-none",
                state.loadingNomor || !state.previewNomor
                  ? "text-[16px] font-medium italic text-slate-400 dark:text-slate-500"
                  : "text-[22px] font-bold text-slate-800 dark:text-slate-100"
              )}>
                {nomorRegister}
              </p>
            </div>
            <Badge className="shrink-0 mt-0.5 text-[12px] font-medium px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              {deptBadge}
            </Badge>
          </div>
        </div>

        <div className="px-6 py-5 flex flex-col gap-4 lg:overflow-y-auto [&::-webkit-scrollbar]:hidden">
          <FormField label="Departemen">
            <Select value={state.deptId} onValueChange={actions.setDeptId}>
              <SelectTrigger className={cn(inputClass, "w-full h-10 shadow-none")}>
                <SelectValue placeholder="Pilih departemen" />
              </SelectTrigger>
              <SelectContent className="dark:bg-slate-950 border-slate-200 dark:border-slate-800">
                {state.deptList.map((d: any) => (
                  <SelectItem key={d.id} value={d.id} className="text-[14px] cursor-pointer">
                    {d.shortName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>

          <FormField label="Asal Surat">
            <input
              className={cn(inputClass, "rounded-xl h-10")}
              value={state.asalSurat}
              onChange={e => actions.setAsalSurat(e.target.value)}
              placeholder="Masukkan asal surat"
            />
          </FormField>

          <FormField label="Tujuan">
            <div className={cn(
              "w-full px-3.5 h-10 flex items-center rounded-xl border text-[14px] font-medium border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 cursor-not-allowed select-none",
              state.selectedDept
                ? "text-slate-600 dark:text-slate-400"
                : "text-slate-400 dark:text-slate-500"
            )}>
              {state.selectedDept?.shortName || "Otomatis dari departemen"}
            </div>
          </FormField>

          <FormField label="Tanggal Terima">
            <div className={cn(readonlyClass, "w-full px-3.5 h-10 flex items-center rounded-xl border text-[14px] font-medium border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-400 dark:text-slate-500 cursor-not-allowed select-none")}>
              {format(parseLocalDate(state.tanggalTerima), "dd MMMM yyyy", { locale: localeID })}
            </div>
          </FormField>
        </div>
      </div>
    </div>
  )
}
