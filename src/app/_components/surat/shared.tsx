import { cn } from "@/lib/utils"

// ─── Types ───────────────────────────────────────────────────────────────────

export interface DataSurat {
  id:            number
  nomor:         string
  deptId:        string
  dept:          { id: string; shortName: string }
  asalSurat:     string
  perihal:       string
  tujuan:        string
  noSurat:       string | null
  lampiran:      string | null
  tanggalSurat:  string
  tanggalTerima: string
}

export interface FormState {
  nomor:         string
  perihal:       string
  asalSurat:     string
  tujuan:        string
  noSurat:       string
  lampiran:      string
  tanggalSurat:  string
  tanggalTerima: string
  deptId:        string
}

export const EMPTY_FORM: FormState = {
  nomor:         "",
  perihal:       "",
  asalSurat:     "",
  tujuan:        "",
  noSurat:       "",
  lampiran:      "",
  tanggalSurat:  "",
  tanggalTerima: new Date().toISOString().slice(0, 10),
  deptId:        "",
}

export type Role = "ADMIN" | "STAFF" | "PKL"

// ─── Styles ──────────────────────────────────────────────────────────────────

export const inputClass = cn(
  "w-full px-3 py-2 rounded-lg text-[13px] font-medium transition-all duration-200",
  "border border-slate-200 dark:border-slate-800",
  "bg-white dark:bg-slate-950",
  "text-slate-800 dark:text-slate-200",
  "placeholder:text-slate-400 dark:placeholder:text-slate-500",
  "hover:border-blue-400 dark:hover:border-blue-700",
  "focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-500"
)

export const readonlyClass = cn(
  "w-full px-3 py-2 rounded-lg text-[13px] font-medium",
  "border border-slate-100 dark:border-slate-800/60",
  "bg-slate-50 dark:bg-slate-900/50",
  "text-slate-400 dark:text-slate-500",
  "cursor-not-allowed select-none"
)

// ─── Helpers ─────────────────────────────────────────────────────────────────

export function formatTanggal(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "2-digit", month: "long", year: "numeric",
  })
}

// ─── FormField ────────────────────────────────────────────────────────────────

export function FormField({
  label, optional = false, hint, children,
}: {
  label: string; optional?: boolean; hint?: string; children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-1.5">
        <label className="text-[10px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          {label}
        </label>
        {optional && (
          <span className="text-[10px] normal-case font-normal text-slate-400 dark:text-slate-500">
            (opsional)
          </span>
        )}
        {hint && (
          <span className="text-[10px] normal-case font-normal text-blue-500 dark:text-blue-400">
            {hint}
          </span>
        )}
      </div>
      {children}
    </div>
  )
}