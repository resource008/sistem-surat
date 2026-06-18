import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { FormField, readonlyClass } from "../shared"

export function RegisterInfoPanel({ state, actions }: any) {
  const deptSelectValue = state.form.deptId === state.original.dept?.id ? "" : state.form.deptId

  return (
    <div className="w-full lg:w-4/12 xl:w-4/12 flex flex-col gap-4 lg:h-full lg:pb-6">
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 overflow-hidden flex flex-col max-h-full">
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shrink-0">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[12px] font-medium text-slate-400 dark:text-slate-500 mb-1">
                Nomor Register
              </p>
              <span className="text-[22px] font-mono font-bold text-slate-800 dark:text-slate-100 leading-none">
                {state.previewNomor ?? state.original.nomor}
              </span>
            </div>
            <Badge className="shrink-0 mt-0.5 text-[12px] font-medium px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              {state.selectedDept?.shortName || state.original.dept?.shortName}
            </Badge>
          </div>
        </div>

        <div className="px-6 py-5 flex flex-col gap-4 lg:overflow-y-auto [&::-webkit-scrollbar]:hidden">
          <FormField label="Departemen" error={state.formErrors.deptId}>
            <Select value={deptSelectValue} onValueChange={val => actions.setField("deptId", val)}>
              <SelectTrigger className={cn("w-full text-[14px] rounded-xl h-10", state.formErrors.deptId && "border-red-500")}>
                <SelectValue placeholder="Pilih departemen" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                {state.deptList.map((d: any) => (
                  <SelectItem key={d.id} value={d.id} className="text-[14px] cursor-pointer">
                    {d.shortName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>

          <div className="flex flex-col gap-4">
            <FormField label="Asal Surat" error={state.formErrors.asalSurat}>
              <Input
                value={state.form.asalSurat}
                onChange={e => actions.setField("asalSurat", e.target.value)}
                placeholder="Contoh: PT. Maju Mundur"
                className={cn("text-[14px] rounded-xl h-10", state.formErrors.asalSurat && "border-red-500 focus-visible:ring-red-500")}
              />
            </FormField>
            <FormField label="Tujuan">
              <div className={cn("w-full px-3.5 h-10 flex items-center rounded-xl border text-[14px] font-medium border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 cursor-not-allowed select-none", state.form.tujuan ? "text-slate-600 dark:text-slate-400" : "text-slate-400 dark:text-slate-500")}>
                {state.form.tujuan || "Otomatis dari departemen"}
              </div>
            </FormField>
          </div>

          <FormField label="Tanggal Terima">
            <div className={cn(readonlyClass, "w-full px-3.5 h-10 flex items-center rounded-xl border text-[14px] font-medium border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-400 dark:text-slate-500 cursor-not-allowed select-none")}>
              {new Date(state.original.tanggalTerima).toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" })}
            </div>
          </FormField>
        </div>
      </div>
    </div>
  )
}
