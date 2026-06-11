import { Info } from "lucide-react"
import { cn } from "@/lib/utils"

export function DepartemenFormInfo({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "rounded-lg bg-blue-50 px-5 py-4 text-sm text-slate-900 dark:bg-blue-950/30 dark:text-slate-100",
        className
      )}
    >
      <div className="mb-5 flex items-center gap-3 text-blue-600 dark:text-blue-300">
        <Info className="size-5" />
        <h3 className="text-base font-semibold">
          Informasi pengisian departemen
        </h3>
      </div>

      <ul className="list-disc space-y-2 pl-6 text-[13px] leading-relaxed">
        <li>Masukkan nama departemen dengan lengkap dan detail</li>
        <li>Masukkan singkatan departemen yang dibuat karena akan digunakan saat registrasi surat</li>
      </ul>
    </div>
  )
} 